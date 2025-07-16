// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    // Criptografa a senha antes de salvar
    user.password = await bcrypt.hash(createUserDto.password, 10);
    user.role = createUserDto.role || 'user';
    return this.usersRepository.save(user);
  }

  // Exemplo para encontrar usuário por email (importante para autenticação)
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUserName(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username: username } });
  }

  // Outros métodos aqui...
}
