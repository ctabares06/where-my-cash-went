import {
  PeriodicEntity,
  PeriodicProps,
  PeriodicWithTransactionProps,
} from '@/domains/periodic/entities/periodic.entity';

/**
 * Periodic Repository Port - Interface defined in domain
 * Implementation will be in infrastructure layer (Prisma adapter)
 */
export interface IPeriodicRepository {
  create(
    entity: PeriodicEntity,
    transactionId: string,
    nextOccurrence: Date,
  ): Promise<PeriodicProps>;
  findById(id: string): Promise<PeriodicEntity | null>;
  findByIdAndUserId(id: string, userId: string): Promise<PeriodicEntity | null>;
  findAllByUserId(userId: string): Promise<PeriodicEntity[]>;
  findDuePeriodics(currentDate: Date): Promise<PeriodicWithTransactionProps[]>;
  update(entity: PeriodicEntity, nextOccurrence: Date): Promise<PeriodicProps>;
  updateNextOccurrence(
    id: string,
    nextOccurrence: Date,
  ): Promise<PeriodicProps>;
  delete(id: string, userId: string): Promise<PeriodicProps>;
}
