import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';
import { Cycle_T } from '@/lib/ormClient/enums';

export class CreatePeriodicDto {
  @IsEnum(Cycle_T)
  cycle!: Cycle_T;

  @ValidateIf((object: CreatePeriodicDto) => object.cycle === Cycle_T.custom)
  @IsInt()
  @Min(1)
  duration?: number;

  @IsUUID()
  transactionId!: string;

  @IsOptional()
  @IsDate()
  startDate?: Date;
}
