import {
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { Transaction_T } from '../lib/ormClient/enums';
import { Transaction } from 'src/lib/ormClient/client';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTransactionDto implements Partial<Transaction> {
  @IsInt()
  quantity!: number;

  @IsString()
  description!: string;

  @IsOptional()
  @IsUUID(4)
  categoryId?: string;

  @IsOptional()
  @IsUUID(4, { each: true })
  tags?: string[];

  @IsEnum(Transaction_T)
  @ValidateIf((object: CreateTransactionDto) => {
    const hasCategory = Object.hasOwn(object, 'categoryId');

    if (hasCategory) {
      return object.categoryId === undefined || object.categoryId === null;
    }

    return true;
  })
  transactionType?: Transaction_T;
}

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
