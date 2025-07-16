import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PagamentosService } from './pagamento.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';

@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}
  @Post()
  create(
    @Body() createPagamentoDto: CreatePagamentoDto | CreatePagamentoDto[],
  ) {
    return this.pagamentosService.create(createPagamentoDto);
  }

  @Get()
  findAll() {
    return this.pagamentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagamentosService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagamentosService.remove(+id);
  }
}
