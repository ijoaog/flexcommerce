import { PartialType } from '@nestjs/mapped-types';
import { CreateVendaItemDto } from './create-venda-item.dto';

export class UpdateVendaItemDto extends PartialType(CreateVendaItemDto) {}