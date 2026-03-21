import {
  TransactionEntity,
  TransactionWithRelations,
  TransactionProps,
} from '../entities/transaction.entity';

/**
 * Transaction Repository Port - Interface defined in domain
 * Implementation will be in infrastructure layer (Prisma adapter)
 */
export interface ITransactionRepository {
  create(
    entity: TransactionEntity,
    tagIds?: string[],
  ): Promise<TransactionWithRelations>;
  createMany(
    entities: TransactionEntity[],
    tagIds?: string[][],
  ): Promise<TransactionWithRelations[]>;
  findById(id: string): Promise<TransactionEntity | null>;
  findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<TransactionEntity | null>;
  findManyByUserId(
    userId: string,
    limit: number,
    page: number,
  ): Promise<TransactionEntity[]>;
  findByIdWithRelations(id: string): Promise<TransactionWithRelations | null>;
  findManyByUserIdWithRelations(
    userId: string,
    limit: number,
    page: number,
  ): Promise<TransactionWithRelations[]>;
  update(
    entity: TransactionEntity,
    tagIds?: string[],
  ): Promise<TransactionWithRelations>;
  delete(id: string, userId: string): Promise<TransactionProps>;
  deleteTags(transactionId: string): Promise<number>;
}
