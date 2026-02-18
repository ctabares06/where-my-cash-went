import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  name!: string;
}

export class UpdateTagDto extends PartialType(CreateTagDto) {}
