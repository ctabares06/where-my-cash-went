import { Injectable } from '@nestjs/common';
import { PeriodicDomain } from './periodic.domain';
import { CreatePeriodicDto, UpdatePeriodicDto } from './periodic.dto';
import { Cycle_T } from 'src/lib/ormClient/enums';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TransactionDomain } from 'src/transaction/transactions.domain';
import { CreateTransactionDto } from 'src/transaction/transaction.dto';

@Injectable()
export class PeriodicService {
  constructor(
    private periodicDomain: PeriodicDomain,
    private transactionDomain: TransactionDomain,
  ) {}

  create(data: CreatePeriodicDto) {
    const nextOcurrence = this.calculateNextOccurrence(
      data.cycle,
      data.startDate || new Date(Date.now()),
      data.duration || 0,
    );

    return this.periodicDomain.create(data, nextOcurrence);
  }

  async update(data: UpdatePeriodicDto, periodicId: string, userId: string) {
    const currentPeriodic = await this.periodicDomain.getOne(
      periodicId,
      userId,
    );

    if (!currentPeriodic) {
      throw new Error('Register does not exist');
    }

    const nextOccurrence = this.calculateNextOccurrence(
      data.cycle || currentPeriodic.cycle,
      data.startDate || currentPeriodic.nextOcurrence,
      data.duration || 0,
    );

    return this.periodicDomain.update(data, periodicId, nextOccurrence);
  }

  delete(periodicId: string, userId: string) {
    return this.periodicDomain.delete(periodicId, userId);
  }

  getOne(periodicId: string, userId: string) {
    return this.periodicDomain.getOne(periodicId, userId);
  }

  getAll(userId: string) {
    return this.periodicDomain.getAll(userId);
  }

  private calculateNextOccurrence(
    cycle: Cycle_T,
    lastOccurrence: Date,
    duration?: number,
  ): Date {
    const nextOccurrence = new Date(lastOccurrence);

    switch (cycle) {
      case Cycle_T.daily:
        nextOccurrence.setDate(nextOccurrence.getDate() + 1);
        break;
      case Cycle_T.weekly:
        nextOccurrence.setDate(nextOccurrence.getDate() + 7);
        break;
      case Cycle_T.fortnightly:
        nextOccurrence.setDate(nextOccurrence.getDate() + 14);
        break;
      case Cycle_T.monthly:
        nextOccurrence.setMonth(nextOccurrence.getMonth() + 1);
        break;
      case Cycle_T.quarterly:
        nextOccurrence.setMonth(nextOccurrence.getMonth() + 3);
        break;
      case Cycle_T.biannual:
        nextOccurrence.setMonth(nextOccurrence.getMonth() + 6);
        break;
      case Cycle_T.yearly:
        nextOccurrence.setFullYear(nextOccurrence.getFullYear() + 1);
        break;
      case Cycle_T.custom:
        if (duration === undefined || duration <= 1) {
          throw new Error('duration is required for custom cycles');
        }
        nextOccurrence.setDate(nextOccurrence.getDate() + duration);
        break;
      default:
        throw new Error('Unknown occurrence');
    }

    return nextOccurrence;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'createScheduleTransaction',
  })
  async createScheduleTransaction() {
    try {
      const currentDate = new Date();

      const associatedTransactions =
        await this.periodicDomain.getWithTransactionAndTagLteDate(currentDate);

      if (associatedTransactions.length === 0) {
        console.log('No Periodic transactions to process today.');
        return;
      }

      console.log('transactions to create: ', {
        associatedTransactions: associatedTransactions.map((t) => ({
          id: t.id,
          nextOcurrence: t.nextOcurrence.toISOString(),
        })),
      });

      const transactionsPromises = associatedTransactions.map((periodic) => {
        const { transaction } = periodic;

        const createPayload: CreateTransactionDto = {
          ...transaction,
          tags: transaction.tagsOnTransactions.map((obj) => obj.tagId),
        };

        return this.transactionDomain.create(createPayload, transaction.userId);
      });

      const createdTransactions = await Promise.all(transactionsPromises);

      console.log('created transactions: ', {
        createdTransactions: createdTransactions.map((transaction) => ({
          id: transaction.id,
        })),
      });

      const periodicUpdatePromises = associatedTransactions.map((periodic) => {
        const next = this.calculateNextOccurrence(
          periodic.cycle,
          periodic.nextOcurrence,
          periodic.duration || undefined,
        );

        return this.periodicDomain.update({}, periodic.id, next);
      });

      const updatedPeriodics = await Promise.all(periodicUpdatePromises);

      console.log('updated periodic transactions: ', {
        updatedPeriodics: updatedPeriodics.map((p) => ({
          id: p.id,
          nextOcurrence: p.nextOcurrence.toISOString(),
        })),
      });
    } catch (error) {
      console.error('Failed to create transactions in batch', error);
    }
  }
}
