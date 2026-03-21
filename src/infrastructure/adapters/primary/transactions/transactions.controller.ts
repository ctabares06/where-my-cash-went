import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Session,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransactionApplicationService } from '../../../../applications/transactions/transaction.application.service';
import { CreateTransactionDto } from '../../../../applications/transactions/dtos/create-transaction.dto';
import { UpdateTransactionDto } from '../../../../applications/transactions/dtos/update-transaction.dto';
import { TransactionListResponseDto } from '../../../../applications/transactions/dtos/transaction-response.dto';
import type { UserSession } from '../../../../lib/auth.types';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionAppService: TransactionApplicationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(
    @Body() body: CreateTransactionDto | CreateTransactionDto[],
    @Session() session: UserSession,
  ) {
    return this.transactionAppService.create(body, session.user.id);
  }

  @Get()
  async getTransactions(
    @Session() session: UserSession,
    @Query('page') page: string = '0',
    @Query('limit') limit: string = '10',
  ): Promise<TransactionListResponseDto> {
    return this.transactionAppService.getMany(
      session.user.id,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get(':id')
  async getTransactionById(
    @Param('id') transactionId: string,
    @Session() session: UserSession,
  ) {
    return this.transactionAppService.getById(transactionId, session.user.id);
  }

  @Put(':id')
  async updateTransaction(
    @Param('id') transactionId: string,
    @Body() body: UpdateTransactionDto,
    @Session() session: UserSession,
  ) {
    return this.transactionAppService.update(
      transactionId,
      body,
      session.user.id,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(
    @Param('id') transactionId: string,
    @Session() session: UserSession,
  ): Promise<void> {
    await this.transactionAppService.delete(transactionId, session.user.id);
  }
}
