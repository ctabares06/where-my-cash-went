import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTransactionDto, UpdateTransactionDto } from './transaction.dto';
import { Prisma } from '../lib/ormClient/client';
import { TransactionDomain } from './transactions.domain';

@Injectable()
export class TransactionService {
  constructor(private domain: TransactionDomain) {}

  async create(
    data: CreateTransactionDto | CreateTransactionDto[],
    userId: string,
  ) {
    try {
      if (Array.isArray(data)) {
        const transactionPromises = data.map((transaction) => {
          if (transaction.categoryId) {
            transaction.transactionType = undefined;
          }

          return this.domain.create(transaction, userId);
        });

        const results = await Promise.all(transactionPromises);

        return results;
      }

      if (data.categoryId) {
        data.transactionType = undefined;
      }

      return await this.domain.create(data, userId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Transaction creation failed');
    }
  }

  async findAll(userId: string, limit: number, page: number) {
    return this.domain.getMany(userId, limit, page);
  }

  async findOne(id: string, userId: string) {
    return this.domain.getOne(id, userId);
  }

  async update(id: string, data: UpdateTransactionDto, userId: string) {
    const currentTransaction = await this.domain.getOne(id, userId);
    const updateObj = { ...data };

    if (updateObj.categoryId || currentTransaction.categoryId) {
      updateObj.transactionType = undefined;
    }

    if (!updateObj.categoryId && currentTransaction.categoryId) {
      updateObj.categoryId = currentTransaction.categoryId;
    }

    if (data.tags) {
      await this.domain.deleteTransactionTags(id);
    }

    return this.domain.update(updateObj, id, userId);
  }

  async remove(id: string, userId: string) {
    return this.domain.delete(id, userId);
  }
}
