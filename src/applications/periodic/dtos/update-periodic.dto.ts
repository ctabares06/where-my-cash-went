import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsInt, IsOptional, ValidateIf, Min } from 'class-validator';
import { Cycle_T } from '../../../lib/ormClient/enums';
import { CreatePeriodicDto } from './create-periodic.dto';

export class UpdatePeriodicDto extends PartialType(CreatePeriodicDto) {
  @IsOptional()
  @IsEnum(Cycle_T)
  cycle?: Cycle_T;

  @IsOptional()
  @ValidateIf(
    (o: UpdatePeriodicDto) =>
      o !== null && o !== undefined && o.cycle === Cycle_T.custom,
  )
  @IsInt()
  @Min(1)
  duration?: number;
}
