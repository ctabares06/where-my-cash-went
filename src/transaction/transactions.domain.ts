import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTransactionDto, UpdateTransactionDto } from './transaction.dto';
import { Prisma } from '../lib/ormClient/client';

@Injectable()
export class TransactionDomain {
  constructor(private dbService: DatabaseService) {}

  create(data: CreateTransactionDto, userId: string) {
    const createPayload: Prisma.TransactionCreateInput = {
      quantity: data.quantity,
      description: data.description,
      category: {
        connect: {
          id: data.categoryId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    };

    if (data.tags && data.tags.length) {
      createPayload.tagsOnTransactions = {
        createMany: {
          data: data.tags.map((tagId) => ({ tagId })),
        },
      };
    }

    return this.dbService.transaction().create({
      data: createPayload,
      include: {
        category: {
          select: {
            name: true,
            id: true,
          },
        },
        tagsOnTransactions: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  getOne(id: string, userId: string) {
    return this.dbService.transaction().findFirstOrThrow({
      where: {
        id,
        userId,
      },
    });
  }

  getMany(userId: string, limit: number, page: number) {
    return this.dbService.transaction().findMany({
      where: {
        userId,
      },
      take: limit,
      skip: page,
    });
  }

  async update(data: UpdateTransactionDto, id: string, userId: string) {
    const updatePayload: Prisma.TransactionUpdateInput = {
      quantity: data.quantity,
      description: data.description,
      category: {
        connect: {
          id: data.categoryId,
        },
      },
    };

    if (data.tags && data.tags.length) {
      updatePayload.tagsOnTransactions = {
        createMany: {
          data: data.tags.map((tag) => ({
            tagId: tag,
          })),
        },
      };
    }

    return this.dbService.transaction().update({
      where: {
        id,
        userId,
      },
      data: updatePayload,
      include: {
        category: {
          select: {
            name: true,
            id: true,
          },
        },
        tagsOnTransactions: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  deleteTransactionTags(transactionId: string) {
    return this.dbService.tagsOnTransactions().deleteMany({
      where: {
        transactionId,
      },
    });
  }

  delete(id: string, userId: string) {
    return this.dbService.transaction().delete({
      where: {
        id,
        userId,
      },
    });
  }
}
