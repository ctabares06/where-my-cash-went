import {
  TransactionEntity,
  TransactionWithRelations,
} from '@/domains/transactions/entities/transaction.entity';
import { Transaction } from '@/lib/ormClient/client';

export class TransactionMapper {
  static toDomain(entity: Transaction): TransactionEntity {
    return TransactionEntity.create({
      id: entity.id,
      quantity: entity.quantity,
      description: entity.description,
      userId: entity.userId,
      categoryId: entity.categoryId,
      transactionType: entity.transactionType,
      createdAt: entity.createdAt,
      updatedAt: entity.updateAt,
    });
  }

  static toDomainList(entities: Transaction[]): TransactionEntity[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  static toProps(entity: TransactionEntity): Omit<Transaction, never> {
    return {
      id: entity.id,
      quantity: entity.quantity,
      description: entity.description,
      userId: entity.userId,
      categoryId: entity.categoryId,
      transactionType: entity.transactionType,
      createdAt: entity.createdAt,
      updateAt: entity.updatedAt,
    } as Omit<Transaction, never>;
  }

  static toWithRelations(
    entity: Transaction,
    category?: { id: string; name: string } | null,
    tags?: Array<{ id: string; name: string }>,
  ): TransactionWithRelations {
    return {
      id: entity.id,
      quantity: entity.quantity,
      description: entity.description,
      userId: entity.userId,
      categoryId: entity.categoryId,
      transactionType: entity.transactionType,
      createdAt: entity.createdAt,
      updatedAt: entity.updateAt,
      category,
      tags,
    };
  }
}
