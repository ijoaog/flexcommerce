import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  async create(@Body() dto: CreateClienteDto) {
    try {
      return await this.clientesService.create(dto);
    } catch (error) {
      throw new HttpException(
        'Erro ao criar cliente: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.clientesService.findAll();
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar clientes: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.clientesService.findOne(Number(id));
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar cliente: ' + error.message,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateClienteDto) {
    try {
      return await this.clientesService.update(Number(id), dto);
    } catch (error) {
      throw new HttpException(
        'Erro ao atualizar cliente: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    try {
      return await this.clientesService.softDelete(Number(id));
    } catch (error) {
      throw new HttpException(
        'Erro ao remover cliente: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
