// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Res,
  Body,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

type LoginDto = {
  username: string;
  password: string;
};

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      body.username,
      body.password,
    );

    if (!user) throw new UnauthorizedException('Usuário ou senha inválidos');

    const { access_token } = await this.authService.login(user);

    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    res.cookie('token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
      path: '/',
    });

    res.cookie('public_token', 'logged', {
      httpOnly: false,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
      path: '/',
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', { path: '/' });
    res.clearCookie('public_token', { path: '/' });
    return { message: 'Logout realizado' };
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Post('change-password')
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(
      req.userId,
      dto.oldPassword,
      dto.newPassword,
    );
  }
}
