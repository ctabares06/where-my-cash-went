import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';
import { IsValidUnicode } from '../../../lib/validations';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsValidUnicode()
  unicode?: string;
}
