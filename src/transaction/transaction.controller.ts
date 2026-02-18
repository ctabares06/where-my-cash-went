import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto, UpdateTransactionDto } from './transaction.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Session() session: UserSession,
  ) {
    return this.transactionService.create(
      createTransactionDto,
      session.user.id,
    );
  }

  @Get()
  findAll(
    @Session() session: UserSession,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return this.transactionService.findAll(session.user.id, limit, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Session() session: UserSession) {
    return this.transactionService.findOne(id, session.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Session() session: UserSession,
  ) {
    return this.transactionService.update(
      id,
      updateTransactionDto,
      session.user.id,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: UserSession) {
    return this.transactionService.remove(id, session.user.id);
  }
}
