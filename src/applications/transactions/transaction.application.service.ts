import { TransactionsDomainService } from '../../domains/transactions/domain/transactions.domain.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import {
  TransactionResponseDto,
  TransactionListResponseDto,
} from './dtos/transaction-response.dto';
import { InternalServerErrorException } from '@nestjs/common';

/**
 * Transaction Application Service - Use case orchestration
 */
export class TransactionApplicationService {
  constructor(
    private readonly transactionDomainService: TransactionsDomainService,
  ) {}

  async create(
    input: CreateTransactionDto | CreateTransactionDto[],
    userId: string,
  ): Promise<TransactionResponseDto> {
    try {
      if (Array.isArray(input)) {
        const results = await this.transactionDomainService.createMany(
          input.map((dto) => ({
            quantity: dto.quantity,
            description: dto.description,
            categoryId: dto.categoryId,
            tags: dto.tags,
            transactionType: dto.transactionType,
          })),
          userId,
        );
        return {
          data: results,
          count: results.length,
        };
      }

      const result = await this.transactionDomainService.create(
        {
          quantity: input.quantity,
          description: input.description,
          categoryId: input.categoryId,
          tags: input.tags,
          transactionType: input.transactionType,
        },
        userId,
      );
      return {
        data: [result],
        count: 1,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Transaction creation failed',
      );
    }
  }

  async getById(id: string, userId: string): Promise<TransactionResponseDto> {
    const result = await this.transactionDomainService.getById(id, userId);
    return {
      data: [result],
      count: 1,
    };
  }

  async getMany(
    userId: string,
    page: number,
    limit: number,
  ): Promise<TransactionListResponseDto> {
    const results = await this.transactionDomainService.getManyByUser(
      userId,
      limit,
      page,
    );
    return {
      data: results,
      page,
      limit,
      count: results.length,
    };
  }

  async update(
    id: string,
    input: UpdateTransactionDto,
    userId: string,
  ): Promise<TransactionResponseDto> {
    const result = await this.transactionDomainService.update(
      id,
      {
        quantity: input.quantity,
        description: input.description,
        categoryId: input.categoryId,
        tags: input.tags,
      },
      userId,
    );
    return {
      data: [result],
      count: 1,
    };
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.transactionDomainService.delete(id, userId);
  }
}
