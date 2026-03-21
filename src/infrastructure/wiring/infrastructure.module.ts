import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClientProvider } from '../adapters/secondary/persistence/prisma/prisma-client.provider';
import { CategoryRepository } from '../adapters/secondary/persistence/repositories/category.repository';
import { TransactionRepository } from '../adapters/secondary/persistence/repositories/transaction.repository';
import { TagRepository } from '../adapters/secondary/persistence/repositories/tag.repository';
import { PeriodicRepository } from '../adapters/secondary/persistence/repositories/periodic.repository';
import {
  CATEGORY_REPOSITORY,
  TRANSACTION_REPOSITORY,
  TAG_REPOSITORY,
  PERIODIC_REPOSITORY,
} from './tokens';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    PrismaClientProvider,
    // Category
    CategoryRepository,
    { provide: CATEGORY_REPOSITORY, useExisting: CategoryRepository },
    // Transaction
    TransactionRepository,
    { provide: TRANSACTION_REPOSITORY, useExisting: TransactionRepository },
    // Tag
    TagRepository,
    { provide: TAG_REPOSITORY, useExisting: TagRepository },
    // Periodic
    PeriodicRepository,
    { provide: PERIODIC_REPOSITORY, useExisting: PeriodicRepository },
  ],
  exports: [
    CategoryRepository,
    TransactionRepository,
    TagRepository,
    PeriodicRepository,
    PrismaClientProvider,
  ],
})
export class InfrastructureModule {}
