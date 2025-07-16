import { PartialType } from '@nestjs/mapped-types';
import { CreateContaReceberDto } from './create-contas-receber.dto';

export class UpdateContaReceberDto extends PartialType(CreateContaReceberDto) {}