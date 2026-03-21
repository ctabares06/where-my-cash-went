import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../../../lib/ormClient/client';
import { IPeriodicRepository } from '../../../../../domains/periodic/ports/periodic.repository.port';
import {
  PeriodicEntity,
  PeriodicProps,
  PeriodicWithTransactionProps,
} from '../../../../../domains/periodic/entities/periodic.entity';
import { PeriodicMapper } from '../mappers/periodic.mapper';

const periodicSelect = {
  id: true,
  transactionId: true,
  cycle: true,
  duration: true,
  nextOcurrence: true,
  createdAt: true,
  updateAt: true,
} as const;

@Injectable()
export class PeriodicRepository implements IPeriodicRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    entity: PeriodicEntity,
    transactionId: string,
    nextOcurrence: Date,
  ): Promise<PeriodicProps> {
    const result = await this.prisma.periodic.create({
      data: {
        id: entity.id,
        transactionId,
        cycle: entity.cycle,
        duration: entity.duration,
        nextOcurrence: nextOcurrence,
      },
    });
    return {
      id: result.id,
      transactionId: result.transactionId,
      cycle: result.cycle,
      duration: result.duration,
      nextOcurrence: result.nextOcurrence,
      createdAt: result.createdAt,
      updatedAt: result.updateAt,
    };
  }

  async findById(id: string): Promise<PeriodicEntity | null> {
    const result = await this.prisma.periodic.findUnique({
      where: { id },
      select: periodicSelect,
    });
    if (!result) return null;
    return PeriodicMapper.toDomain(result);
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<PeriodicEntity | null> {
    const result = await this.prisma.periodic.findFirst({
      where: {
        id,
        transaction: { userId },
      },
      select: periodicSelect,
    });
    if (!result) return null;
    return PeriodicMapper.toDomain(result);
  }

  async findAllByUserId(userId: string): Promise<PeriodicEntity[]> {
    const results = await this.prisma.periodic.findMany({
      where: {
        transaction: { userId },
      },
      select: periodicSelect,
      orderBy: { createdAt: 'desc' },
    });
    return PeriodicMapper.toDomainList(results);
  }

  async findDuePeriodics(
    currentDate: Date,
  ): Promise<PeriodicWithTransactionProps[]> {
    const results = await this.prisma.periodic.findMany({
      where: {
        nextOcurrence: { lte: currentDate },
      },
      include: {
        transaction: {
          include: {
            tagsOnTransactions: {
              include: { tag: true },
            },
          },
        },
      },
    });

    return results.map((r) => ({
      id: r.id,
      transactionId: r.transactionId,
      cycle: r.cycle,
      duration: r.duration,
      nextOcurrence: r.nextOcurrence,
      createdAt: r.createdAt,
      updatedAt: r.updateAt,
      transaction: {
        id: r.transaction.id,
        quantity: r.transaction.quantity,
        description: r.transaction.description,
        userId: r.transaction.userId,
        tagsOnTransactions: r.transaction.tagsOnTransactions.map((t) => ({
          tagId: t.tagId,
          transactionId: t.transactionId,
        })),
      },
    }));
  }

  async update(
    entity: PeriodicEntity,
    nextOcurrence: Date,
  ): Promise<PeriodicProps> {
    const result = await this.prisma.periodic.update({
      where: { id: entity.id },
      data: {
        cycle: entity.cycle,
        duration: entity.duration,
        nextOcurrence: nextOcurrence,
      },
    });
    return {
      id: result.id,
      transactionId: result.transactionId,
      cycle: result.cycle,
      duration: result.duration,
      nextOcurrence: result.nextOcurrence,
      createdAt: result.createdAt,
      updatedAt: result.updateAt,
    };
  }

  async updateNextOccurrence(
    id: string,
    nextOcurrence: Date,
  ): Promise<PeriodicProps> {
    const result = await this.prisma.periodic.update({
      where: { id },
      data: { nextOcurrence },
    });
    return {
      id: result.id,
      transactionId: result.transactionId,
      cycle: result.cycle,
      duration: result.duration,
      nextOcurrence: result.nextOcurrence,
      createdAt: result.createdAt,
      updatedAt: result.updateAt,
    };
  }

  async delete(id: string, userId: string): Promise<PeriodicProps> {
    const result = await this.prisma.periodic.delete({
      where: {
        id,
        transaction: { userId },
      },
    });
    return {
      id: result.id,
      transactionId: result.transactionId,
      cycle: result.cycle,
      duration: result.duration,
      nextOcurrence: result.nextOcurrence,
      createdAt: result.createdAt,
      updatedAt: result.updateAt,
    };
  }
}
