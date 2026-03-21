import { Module } from '@nestjs/common';
import { CategoriesDomainService } from '../../domains/categories/domain/categories.domain.service';
import { TransactionsDomainService } from '../../domains/transactions/domain/transactions.domain.service';
import { TagsDomainService } from '../../domains/tags/domain/tags.domain.service';
import { PeriodicDomainService } from '../../domains/periodic/domain/periodic.domain.service';

@Module({
  providers: [
    CategoriesDomainService,
    TransactionsDomainService,
    TagsDomainService,
    PeriodicDomainService,
  ],
  exports: [
    CategoriesDomainService,
    TransactionsDomainService,
    TagsDomainService,
    PeriodicDomainService,
  ],
})
export class DomainModule {}
