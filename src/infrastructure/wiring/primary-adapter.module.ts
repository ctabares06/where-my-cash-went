import { Module } from '@nestjs/common';
import { ApplicationModule } from './application.module';
import { CategoriesController } from '../adapters/primary/categories/categories.controller';
import { TransactionsController } from '../adapters/primary/transactions/transactions.controller';
import { TagsController } from '../adapters/primary/tags/tags.controller';
import { PeriodicController } from '../adapters/primary/periodic/periodic.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [
    CategoriesController,
    TransactionsController,
    TagsController,
    PeriodicController,
  ],
})
export class PrimaryAdapterModule {}
