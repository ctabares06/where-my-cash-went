import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from '@/domains/transactions/ports/transaction.repository.port';
import {
  TransactionEntity,
  TransactionWithRelations,
  TransactionProps,
} from '@/domains/transactions/entities/transaction.entity';
import { TransactionMapper } from '@/infrastructure/adapters/secondary/persistence/mappers/transaction.mapper';
import { PrismaClientProvider } from '@/infrastructure/adapters/secondary/persistence/prisma/prisma-client.provider';

const transactionSelect = {
  id: true,
  quantity: true,
  description: true,
  userId: true,
  categoryId: true,
  transactionType: true,
  createdAt: true,
  updateAt: true,
} as const;

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaClientProvider) {}

  async create(
    entity: TransactionEntity,
    tagIds?: string[],
  ): Promise<TransactionWithRelations> {
    const data = TransactionMapper.toProps(entity);
    const result = await this.prisma.transaction.create({
      data: {
        ...data,
        tagsOnTransactions: tagIds
          ? { create: tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
      include: {
        category: { select: { id: true, name: true } },
        tagsOnTransactions: {
          include: { tag: { select: { id: true, name: true } } },
        },
      },
    });

    return TransactionMapper.toWithRelations(
      result,
      result.category,
      result.tagsOnTransactions.map((t) => ({
        id: t.tag.id,
        name: t.tag.name,
      })),
    );
  }

  async createMany(
    entities: TransactionEntity[],
    tagIds?: string[][],
  ): Promise<TransactionWithRelations[]> {
    const results: TransactionWithRelations[] = [];

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const tags = tagIds?.[i];
      const result = await this.create(entity, tags);
      results.push(result);
    }

    return results;
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const result = await this.prisma.transaction.findUnique({
      where: { id },
      select: transactionSelect,
    });
    if (!result) return null;
    return TransactionMapper.toDomain(result);
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<TransactionEntity | null> {
    const result = await this.prisma.transaction.findFirst({
      where: { id, userId },
      select: transactionSelect,
    });
    if (!result) return null;
    return TransactionMapper.toDomain(result);
  }

  async findManyByUserId(
    userId: string,
    limit: number,
    page: number,
  ): Promise<TransactionEntity[]> {
    const results = await this.prisma.transaction.findMany({
      where: { userId },
      select: transactionSelect,
      skip: page * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return TransactionMapper.toDomainList(results);
  }

  async findByIdWithRelations(
    id: string,
  ): Promise<TransactionWithRelations | null> {
    const result = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        tagsOnTransactions: {
          include: { tag: { select: { id: true, name: true } } },
        },
      },
    });

    if (!result) return null;

    return TransactionMapper.toWithRelations(
      result,
      result.category,
      result.tagsOnTransactions.map((t) => ({
        id: t.tag.id,
        name: t.tag.name,
      })),
    );
  }

  async findManyByUserIdWithRelations(
    userId: string,
    limit: number,
    page: number,
  ): Promise<TransactionWithRelations[]> {
    const results = await this.prisma.transaction.findMany({
      where: { userId },
      include: {
        category: { select: { id: true, name: true } },
        tagsOnTransactions: {
          include: { tag: { select: { id: true, name: true } } },
        },
      },
      skip: page * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return results.map((r) =>
      TransactionMapper.toWithRelations(
        r,
        r.category,
        r.tagsOnTransactions.map((t) => ({ id: t.tag.id, name: t.tag.name })),
      ),
    );
  }

  async update(
    entity: TransactionEntity,
    tagIds?: string[],
  ): Promise<TransactionWithRelations> {
    const data = TransactionMapper.toProps(entity);

    if (tagIds !== undefined) {
      await this.prisma.tagsOnTransactions.deleteMany({
        where: { transactionId: entity.id },
      });
    }

    const result = await this.prisma.transaction.update({
      where: { id: entity.id },
      data: {
        ...data,
        tagsOnTransactions: tagIds
          ? { create: tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
      include: {
        category: { select: { id: true, name: true } },
        tagsOnTransactions: {
          include: { tag: { select: { id: true, name: true } } },
        },
      },
    });

    return TransactionMapper.toWithRelations(
      result,
      result.category,
      result.tagsOnTransactions.map((t) => ({
        id: t.tag.id,
        name: t.tag.name,
      })),
    );
  }

  async delete(id: string, userId: string): Promise<TransactionProps> {
    const result = await this.prisma.transaction.delete({
      where: { id, userId },
    });
    return {
      id: result.id,
      quantity: result.quantity,
      description: result.description,
      userId: result.userId,
      categoryId: result.categoryId,
      transactionType: result.transactionType,
      createdAt: result.createdAt,
      updatedAt: result.updateAt,
    };
  }

  async deleteTags(transactionId: string): Promise<number> {
    const result = await this.prisma.tagsOnTransactions.deleteMany({
      where: { transactionId },
    });
    return result.count;
  }
}
