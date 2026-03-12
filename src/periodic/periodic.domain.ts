import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from 'src/lib/ormClient/client';
import { CreatePeriodicDto, UpdatePeriodicDto } from './periodic.dto';

// reusable payload for getOne
const periodicSelect = {
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
} satisfies Prisma.PeriodicSelect;

export type PeriodicSelectPayload = Prisma.PeriodicGetPayload<{
  select: typeof periodicSelect;
}>;

// payload for getAll including transaction id
const periodicIncludeTransaction = {
  transaction: {
    select: {
      id: true,
    },
  },
} satisfies Prisma.PeriodicInclude;

export type PeriodicIncludeTransactionPayload = Prisma.PeriodicGetPayload<{
  include: typeof periodicIncludeTransaction;
}>;

// payload for getWithTransactionAndTagLteDate
const periodicWithTransactionAndTagSelect = {
  id: true,
  nextOcurrence: true,
  cycle: true,
  duration: true,
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
} satisfies Prisma.PeriodicSelect;

export type PeriodicWithTransactionTagPayload = Prisma.PeriodicGetPayload<{
  select: typeof periodicWithTransactionAndTagSelect;
}>;

export type CreatePeriodicDomain = Prisma.PeriodicCreateInput;
export type UpdatePeriodicDomain = Prisma.PeriodicUpdateInput;

@Injectable()
export class PeriodicDomain {
  constructor(private dbService: DatabaseService) {}

  create(data: CreatePeriodicDto, next: Date) {
    const createPeriodic: CreatePeriodicDomain = {
      cycle: data.cycle,
      duration: data.duration,
      transaction: {
        connect: {
          id: data.transactionId,
        },
      },
      nextOcurrence: next,
    };

    return this.dbService.periodic().create({
      data: createPeriodic,
    });
  }

  update(data: UpdatePeriodicDto, periodicId: string, next: Date) {
    const updatePeriodic: UpdatePeriodicDomain = {
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
      select: periodicSelect,
    });
  }

  getAll(userId: string) {
    return this.dbService.periodic().findMany({
      where: {
        transaction: {
          userId,
        },
      },
      include: periodicIncludeTransaction,
    });
  }

  getWithTransactionAndTagLteDate(date: Date) {
    return this.dbService.periodic().findMany({
      where: {
        nextOcurrence: {
          lte: date,
        },
      },
      select: periodicWithTransactionAndTagSelect,
    });
  }
}
