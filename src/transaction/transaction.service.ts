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
        const transactionPromises = data.map((transaction) =>
          this.domain.create(transaction, userId),
        );

        const results = await Promise.all(transactionPromises);

        return results;
      }

      if (data.categoryId) {
        delete data.transactionType;
      }

      return this.domain.create(data, userId);
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
    return this.domain.update(data, id, userId);
  }

  async remove(id: string, userId: string) {
    return this.domain.delete(id, userId);
  }
}
