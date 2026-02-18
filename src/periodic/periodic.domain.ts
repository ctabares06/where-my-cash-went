import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from 'src/lib/ormClient/client';
import { CreatePeriodicDto, UpdatePeriodicDto } from './periodic.dto';

@Injectable()
export class PeriodicDomain {
  constructor(private dbService: DatabaseService) {}

  create(data: CreatePeriodicDto, transactionId: string, next: Date) {
    const createPeriodic: Prisma.PeriodicCreateInput = {
      ...data,
      transaction: {
        connect: {
          id: transactionId,
        },
      },
      nextOcurrence: next,
    };

    return this.dbService.periodic().create({
      data: createPeriodic,
    });
  }

  update(data: UpdatePeriodicDto, periodicId: string, next: Date) {
    const updatePeriodic: Prisma.PeriodicUpdateInput = {
      ...data,
      nextOcurrence: next,
    };

    return this.dbService.periodic().update({
      where: {
        id: periodicId,
      },
      data: updatePeriodic,
    });
  }

  delete(periodicId: string, userId: string) {
    return this.dbService.periodic().delete({
      where: {
        id: periodicId,
        transaction: {
          userId,
        },
      },
    });
  }

  getOne(periodicId: string, userId: string) {
    return this.dbService.periodic().findUnique({
      where: {
        id: periodicId,
        transaction: {
          userId,
        },
      },
      select: {
        id: true,
        cycle: true,
        duration: true,
        createdAt: true,
        updateAt: true,
        nextOcurrence: true,
        transaction: {
          select: {
            id: true,
            description: true,
          },
        },
      },
    });
  }

  getAll(userId: string) {
    return this.dbService.periodic().findMany({
      where: {
        transaction: {
          userId,
        },
      },
      include: {
        transaction: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  getWithTransactionAndTagLteDate(date: Date) {
    return this.dbService.periodic().findMany({
      where: {
        nextOcurrence: {
          lte: date,
        },
      },
      include: {
        transaction: {
          select: {
            quantity: true,
            description: true,
            userId: true,
            tagsOnTransactions: {
              select: {
                tagId: true,
                transactionId: true,
              },
            },
          },
        },
      },
    });
  }
}
