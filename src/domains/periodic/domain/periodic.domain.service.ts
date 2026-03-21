import {
  PeriodicEntity,
  PeriodicProps,
  PeriodicWithTransactionProps,
} from '../entities/periodic.entity';
import { IPeriodicRepository } from '../ports/periodic.repository.port';
import { ITransactionRepository } from '../../transactions/ports/transaction.repository.port';
import { NotFoundDomainException } from '../../shared/errors/domain.exception';
import { PeriodicValidationException } from '../errors/periodic.errors';
import { DomainService } from '../../base/domain-service';
import { Cycle_T } from '../../../lib/ormClient/enums';
import { TransactionEntity } from '../../transactions/entities/transaction.entity';

export type CreatePeriodicInput = {
  cycle: Cycle_T;
  duration?: number;
  transactionId: string;
  startDate?: Date;
};

export type UpdatePeriodicInput = {
  cycle?: Cycle_T;
  duration?: number;
  startDate?: Date;
};

/**
 * Periodic Domain Service - Pure business logic, no framework dependencies
 */
export class PeriodicDomainService extends DomainService {
  constructor(
    private readonly periodicRepository: IPeriodicRepository,
    private readonly transactionRepository: ITransactionRepository,
  ) {
    super();
  }

  async create(input: CreatePeriodicInput): Promise<PeriodicProps> {
    // Validate transaction exists
    const transaction = await this.transactionRepository.findById(
      input.transactionId,
    );
    if (!transaction) {
      throw new PeriodicValidationException('Transaction does not exist');
    }

    // Validate duration for custom cycles
    if (
      input.cycle === Cycle_T.custom &&
      (!input.duration || input.duration <= 1)
    ) {
      throw new PeriodicValidationException(
        'Duration is required for custom cycles',
      );
    }

    const startDate = input.startDate ?? new Date();
    const entity = PeriodicEntity.createNew({
      cycle: input.cycle,
      duration:
        input.cycle === Cycle_T.custom ? (input.duration ?? null) : null,
      transactionId: input.transactionId,
      nextOcurrence: startDate,
    });

    // Calculate first occurrence
    const nextOccurrence = entity.calculateNextOccurrence(startDate);

    return this.periodicRepository.create(
      entity,
      input.transactionId,
      nextOccurrence,
    );
  }

  async update(
    id: string,
    userId: string,
    input: UpdatePeriodicInput,
  ): Promise<PeriodicEntity> {
    const existing = await this.periodicRepository.findByIdAndUserId(
      id,
      userId,
    );

    if (!existing) {
      throw new NotFoundDomainException('Periodic', id);
    }

    // Validate duration for custom cycles if being set
    if (
      input.cycle === Cycle_T.custom &&
      (!input.duration || input.duration <= 1)
    ) {
      throw new PeriodicValidationException(
        'Duration is required for custom cycles',
      );
    }

    let updated = existing;
    if (input.cycle) {
      updated = updated.updateCycle(input.cycle, input.duration);
    }

    const nextOccurrence = updated.calculateNextOccurrence(
      input.startDate ?? existing.nextOcurrence,
    );

    await this.periodicRepository.update(updated, nextOccurrence);
    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    const existing = await this.periodicRepository.findByIdAndUserId(
      id,
      userId,
    );

    if (!existing) {
      throw new NotFoundDomainException('Periodic', id);
    }

    await this.periodicRepository.delete(id, userId);
  }

  async getById(id: string, userId: string): Promise<PeriodicEntity> {
    const entity = await this.periodicRepository.findByIdAndUserId(id, userId);

    if (!entity) {
      throw new NotFoundDomainException('Periodic', id);
    }

    return entity;
  }

  async getAllByUser(userId: string): Promise<PeriodicEntity[]> {
    return this.periodicRepository.findAllByUserId(userId);
  }

  async getDuePeriodics(
    currentDate: Date,
  ): Promise<PeriodicWithTransactionProps[]> {
    return this.periodicRepository.findDuePeriodics(currentDate);
  }

  async processDuePeriodic(
    periodicWithTx: PeriodicWithTransactionProps,
    currentDate: Date,
  ): Promise<void> {
    // Create transaction based on periodic template
    const newTransaction = TransactionEntity.createNew({
      quantity: periodicWithTx.transaction.quantity,
      description: periodicWithTx.transaction.description,
      userId: periodicWithTx.transaction.userId,
      categoryId: null,
      transactionType: null,
    });

    const tagIds = periodicWithTx.transaction.tagsOnTransactions.map(
      (t) => t.tagId,
    );
    await this.transactionRepository.create(newTransaction, tagIds);

    // Update periodic's next occurrence
    const entity = PeriodicEntity.create(periodicWithTx);
    const nextOccurrence = entity.calculateNextOccurrence(currentDate);
    await this.periodicRepository.updateNextOccurrence(
      periodicWithTx.id,
      nextOccurrence,
    );
  }
}
