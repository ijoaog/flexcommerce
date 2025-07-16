// src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { User } from '../users/entities/user.entity';
import { EmailService } from 'src/email/email.service'; // Importa EmailService personalizado
import { v4 as uuidv4 } from 'uuid';

type UserType = {
  id: string | number;
  name: string;
  email: string;
  role: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(PasswordResetToken)
    private tokenRepository: Repository<PasswordResetToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService, // Injeta EmailService aqui
  ) {}

  async validateUser(username: string, password: string): Promise<UserType> {
    const user = await this.usersService.findByUserName(username);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha incorreta');
    }
    // Atualiza o lastLogin após validação bem-sucedida
    user.lastLogin = new Date();
    await this.userRepository.save(user);
    return user;
  }

  async login(user: UserType) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // -- Forgot Password
  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    const resetToken = this.tokenRepository.create({
      token,
      user,
      userId: user.id,
      expiresAt,
    });

    await this.tokenRepository.save(resetToken);

    // Use o método do EmailService para enviar o e-mail
    //TODO - DEIXAR A URL DESSE SERVIÇO EM VARIAVEL DE AMBIENTE
    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Recuperação de senha',
      template: 'reset-password', // nome do arquivo reset-password.hbs em templates/
      context: {
        token,
        url: `https://flexcommerce.com.br/reset-password?token=${token}`,
      },
    });

    return { message: 'Email de recuperação enviado' };
  }

  // -- Reset Password com token
  async resetPassword(token: string, newPassword: string) {
    const tokenEntity = await this.tokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!tokenEntity) throw new NotFoundException('Token inválido');
    if (tokenEntity.expiresAt < new Date())
      throw new BadRequestException('Token expirado');

    const user = tokenEntity.user;
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    await this.tokenRepository.delete(tokenEntity.id);

    return { message: 'Senha atualizada com sucesso' };
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('Usuário não encontrado');

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) throw new BadRequestException('Senha antiga incorreta');

      user.password = await bcrypt.hash(newPassword, 10);
      await this.userRepository.save(user);

      return { message: 'Senha alterada com sucesso' };
    } catch (error) {
      // Se o erro já for uma exceção do Nest, repassa, senão lança InternalServerError
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao alterar a senha');
    }
  }
}
