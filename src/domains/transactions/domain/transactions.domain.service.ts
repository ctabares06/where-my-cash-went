import {
  TransactionEntity,
  TransactionWithRelations,
} from '../entities/transaction.entity';
import { ITransactionRepository } from '../ports/transaction.repository.port';
import {
  NotFoundDomainException,
  ValidationDomainException,
} from '../../shared/errors/domain.exception';
import { DomainService } from '../../base/domain-service';
import { Transaction_T } from '../../../lib/ormClient/enums';

export type CreateTransactionInput = {
  quantity: number;
  description: string;
  categoryId?: string;
  tags?: string[];
  transactionType?: Transaction_T;
};

export type UpdateTransactionInput = {
  quantity?: number;
  description?: string;
  categoryId?: string;
  tags?: string[];
};

/**
 * Transaction Domain Service - Pure business logic, no framework dependencies
 */
export class TransactionsDomainService extends DomainService {
  constructor(private readonly transactionRepository: ITransactionRepository) {
    super();
  }

  async create(
    input: CreateTransactionInput,
    userId: string,
  ): Promise<TransactionWithRelations> {
    // Business rule: if categoryId is provided, transactionType should not be set
    const transactionType = input.categoryId
      ? null
      : (input.transactionType ?? null);

    const entity = TransactionEntity.createNew({
      quantity: input.quantity,
      description: input.description,
      userId,
      categoryId: input.categoryId ?? null,
      transactionType,
    });

    return this.transactionRepository.create(entity, input.tags);
  }

  async createMany(
    inputs: CreateTransactionInput[],
    userId: string,
  ): Promise<TransactionWithRelations[]> {
    const entities = inputs.map((input) => {
      const transactionType = input.categoryId
        ? null
        : (input.transactionType ?? null);
      return TransactionEntity.createNew({
        quantity: input.quantity,
        description: input.description,
        userId,
        categoryId: input.categoryId ?? null,
        transactionType,
      });
    });

    const tagIdsArray = inputs.map((input) => input.tags ?? []);
    return this.transactionRepository.createMany(entities, tagIdsArray);
  }

  async getById(id: string, userId: string): Promise<TransactionWithRelations> {
    const entity = await this.transactionRepository.findByIdAndUserId(
      id,
      userId,
    );

    if (!entity) {
      throw new NotFoundDomainException('Transaction', id);
    }

    return this.transactionRepository.findByIdWithRelations(
      id,
    ) as Promise<TransactionWithRelations>;
  }

  async getManyByUser(
    userId: string,
    limit: number,
    page: number,
  ): Promise<TransactionWithRelations[]> {
    if (limit < 1) {
      throw new ValidationDomainException('Limit must be positive');
    }
    if (page < 0) {
      throw new ValidationDomainException('Page cannot be negative');
    }

    return this.transactionRepository.findManyByUserIdWithRelations(
      userId,
      limit,
      page,
    );
  }

  async update(
    id: string,
    input: UpdateTransactionInput,
    userId: string,
  ): Promise<TransactionWithRelations> {
    const existing = await this.transactionRepository.findByIdAndUserId(
      id,
      userId,
    );

    if (!existing) {
      throw new NotFoundDomainException('Transaction', id);
    }

    let entity = existing;
    if (input.quantity !== undefined) {
      entity = entity.updateQuantity(input.quantity);
    }
    if (input.description !== undefined) {
      entity = entity.updateDescription(input.description);
    }
    if (input.categoryId !== undefined) {
      entity = entity.setCategory(input.categoryId);
    }

    // Handle tags update
    if (input.tags !== undefined) {
      await this.transactionRepository.deleteTags(id);
    }

    return this.transactionRepository.update(entity, input.tags);
  }

  async delete(id: string, userId: string): Promise<void> {
    const existing = await this.transactionRepository.findByIdAndUserId(
      id,
      userId,
    );

    if (!existing) {
      throw new NotFoundDomainException('Transaction', id);
    }

    await this.transactionRepository.delete(id, userId);
  }
}
