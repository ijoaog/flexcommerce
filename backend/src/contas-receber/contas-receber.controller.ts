import { Controller, Get, Post, Body, Param, Delete, BadRequestException } from '@nestjs/common';
import { ContasReceberService } from './contas-receber.service';
import { CreateContaReceberDto } from './dto/create-contas-receber.dto';

@Controller('contas-receber')
export class ContasReceberController {
  constructor(private readonly contasReceberService: ContasReceberService) {}

  @Post()
  create(@Body() data: CreateContaReceberDto | CreateContaReceberDto[]) {
    return this.contasReceberService.create(data);
  }

  @Get()
  findAll() {
    return this.contasReceberService.findAllActives();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contasReceberService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contasReceberService.remove(+id);
  }

  // Nova rota para pagar parcialmente uma conta
  @Post('pagar-pendente/:contaId')
  async pagarPendente(
    @Param('contaId') contaId: string,
    @Body('pagamentos')
    pagamentos: { valor: number; forma_pagamento: string , observacoes: string}[],
  ) {
    const id = Number(contaId);
    if (isNaN(id)) {
      throw new BadRequestException('ID da conta inválido');
    }
    return this.contasReceberService.pagarParcial(id, pagamentos);
  }
}
