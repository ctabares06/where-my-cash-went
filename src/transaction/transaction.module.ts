import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { DatabaseService } from 'src/database/database.service';
import { TransactionDomain } from './transactions.domain';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, TransactionDomain, DatabaseService],
  exports: [TransactionService],
})
export class TransactionModule {}
