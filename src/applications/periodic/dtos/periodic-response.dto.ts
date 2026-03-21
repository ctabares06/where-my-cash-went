import { PeriodicProps } from '../../../domains/periodic/entities/periodic.entity';

export type PeriodicResponseDto = {
  data: PeriodicProps[];
  count: number;
};

export type PeriodicListResponseDto = {
  data: PeriodicProps[];
  count: number;
};
