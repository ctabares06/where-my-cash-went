import { Module } from '@nestjs/common';
import { ApplicationModule } from '@/infrastructure/wiring/application.module';
import { CategoriesController } from '@/infrastructure/adapters/primary/categories/categories.controller';
import { TransactionsController } from '@/infrastructure/adapters/primary/transactions/transactions.controller';
import { TagsController } from '@/infrastructure/adapters/primary/tags/tags.controller';
import { PeriodicController } from '@/infrastructure/adapters/primary/periodic/periodic.controller';
import { HealthController } from '@/infrastructure/adapters/primary/health/health.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), ApplicationModule],
  controllers: [
    CategoriesController,
    TransactionsController,
    TagsController,
    PeriodicController,
    HealthController,
  ],
})
export class PrimaryAdapterModule {}
