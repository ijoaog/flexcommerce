import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

// Função para extrair o token do cookie
const extractJwtFromCookie = (req: Request): string | null => {
  if (req?.cookies?.token) {
    return req.cookies.token;
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const jwtSecret =
      configService.get<string>('JWT_SECRET') || 'sua_chave_secreta';

    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(req: Request, payload: any) {
    if (!payload || !payload.sub || !payload.email) {
      throw new UnauthorizedException('Token JWT inválido ou incompleto.');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  }
}
