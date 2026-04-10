import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateTransactionDto } from '@/applications/transactions/dtos/create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID(4)
  categoryId?: string;

  @IsOptional()
  @IsUUID(4, { each: true })
  tags?: string[];
}
