import {
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { Transaction_T } from '../../../lib/ormClient/enums';

export class CreateTransactionDto {
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
