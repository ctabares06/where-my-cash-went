import { Module } from '@nestjs/common';
import { PrismaClientProvider } from '@/infrastructure/adapters/secondary/persistence/prisma/prisma-client.provider';
import { CategoryRepository } from '@/infrastructure/adapters/secondary/persistence/repositories/category.repository';
import { TransactionRepository } from '@/infrastructure/adapters/secondary/persistence/repositories/transaction.repository';
import { TagRepository } from '@/infrastructure/adapters/secondary/persistence/repositories/tag.repository';
import { PeriodicRepository } from '@/infrastructure/adapters/secondary/persistence/repositories/periodic.repository';
import { HealthRepository } from '@/infrastructure/adapters/secondary/persistence/repositories/health.repository';
import {
  CATEGORY_REPOSITORY,
  TRANSACTION_REPOSITORY,
  TAG_REPOSITORY,
  PERIODIC_REPOSITORY,
  HEALTH_CHECK_PORT,
} from '@/infrastructure/wiring/tokens';

@Module({
  providers: [
    PrismaClientProvider,
    // Category
    CategoryRepository,
    { provide: CATEGORY_REPOSITORY, useClass: CategoryRepository },
    // Transaction
    TransactionRepository,
    { provide: TRANSACTION_REPOSITORY, useClass: TransactionRepository },
    // Tag
    TagRepository,
    { provide: TAG_REPOSITORY, useClass: TagRepository },
    // Periodic
    PeriodicRepository,
    { provide: PERIODIC_REPOSITORY, useClass: PeriodicRepository },
    // Health
    HealthRepository,
    { provide: HEALTH_CHECK_PORT, useClass: HealthRepository },
  ],
  exports: [
    CATEGORY_REPOSITORY,
    TRANSACTION_REPOSITORY,
    TAG_REPOSITORY,
    PERIODIC_REPOSITORY,
    HEALTH_CHECK_PORT,
  ],
})
export class InfrastructureModule {}
