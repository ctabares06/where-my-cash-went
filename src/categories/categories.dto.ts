import { IsString, IsEnum, IsOptional } from 'class-validator';
import { IsValidUnicode } from '../lib/validations';
import { Transaction_T } from '../lib/ormClient/enums';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCategoryDto {
  @IsString()
  name!: string;

  @IsValidUnicode()
  unicode!: string;

  @IsEnum(Transaction_T)
  transactionType!: Transaction_T;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsValidUnicode()
  unicode!: string;

  @IsOptional()
  @IsEnum(Transaction_T)
  transactionType!: Transaction_T;
}
