import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { VendaItensService } from './venda-itens.service';
import { CreateVendaItemDto } from './dto/create-venda-item.dto';

@Controller('venda-itens')
export class VendaItensController {
  constructor(private readonly vendaItensService: VendaItensService) {}

  @Post()
  create(@Body() createVendaItemDto: CreateVendaItemDto) {
    return this.vendaItensService.create(createVendaItemDto);
  }

  @Get()
  findAll() {
    return this.vendaItensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendaItensService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendaItensService.remove(+id);
  }
}
