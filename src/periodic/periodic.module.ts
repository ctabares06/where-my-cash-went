import { Module } from '@nestjs/common';
import { GenericController } from './periodic.controller';
import { PeriodicService } from './periodic.service';
import { DatabaseService } from 'src/database/database.service';
import { PeriodicDomain } from './periodic.domain';
import { TransactionDomain } from 'src/transaction/transactions.domain';

@Module({
  controllers: [GenericController],
  providers: [
    DatabaseService,
    TransactionDomain,
    PeriodicDomain,
    PeriodicService,
  ],
})
export class GenericModule {}
