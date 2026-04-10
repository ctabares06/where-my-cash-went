import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { IsValidUnicode } from '@/lib/validations';
import { Transaction_T } from '@/lib/ormClient/enums';

export class CreateCategoryDto {
  @IsString()
  name!: string;

  @IsValidUnicode()
  unicode!: string;

  @IsEnum(Transaction_T)
  transactionType!: Transaction_T;
}

export class CreateCategoryDtoMany {
  @IsArray()
  @IsOptional()
  categories?: CreateCategoryDto[];
}
