import { TransactionWithRelations } from '@/domains/transactions/entities/transaction.entity';

export type TransactionResponseDto = {
  data: TransactionWithRelations[];
  count: number;
};

export type TransactionListResponseDto = {
  data: TransactionWithRelations[];
  page: number;
  limit: number;
  count: number;
};
