import { PartialType } from '@nestjs/mapped-types';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
  ValidateIf,
} from 'class-validator';
import { Cycle_T } from '../lib/ormClient/enums';

export class CreatePeriodicDto {
  @IsEnum(Cycle_T)
  cycle!: Cycle_T;

  @ValidateIf((object: CreatePeriodicDto) => object.cycle === Cycle_T.custom)
  @IsInt()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsDate()
  startDate?: Date;
}

export class UpdatePeriodicDto extends PartialType(CreatePeriodicDto) {
  @IsOptional()
  @IsEnum(Cycle_T)
  cycle?: Cycle_T;

  @IsOptional()
  @ValidateIf((object: CreatePeriodicDto) => object.cycle === Cycle_T.custom)
  @IsInt()
  @Min(1)
  duration?: number;
}
