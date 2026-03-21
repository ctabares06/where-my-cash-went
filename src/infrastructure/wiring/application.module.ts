import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructure.module';
import { CategoriesDomainService } from '../../domains/categories/domain/categories.domain.service';
import { TransactionsDomainService } from '../../domains/transactions/domain/transactions.domain.service';
import { TagsDomainService } from '../../domains/tags/domain/tags.domain.service';
import { PeriodicDomainService } from '../../domains/periodic/domain/periodic.domain.service';
import { CategoryApplicationService } from '../../applications/categories/category.application.service';
import { TransactionApplicationService } from '../../applications/transactions/transaction.application.service';
import { TagApplicationService } from '../../applications/tags/tag.application.service';
import { PeriodicApplicationService } from '../../applications/periodic/periodic.application.service';

@Module({
  imports: [InfrastructureModule],
  providers: [
    // Domain Services
    CategoriesDomainService,
    TransactionsDomainService,
    TagsDomainService,
    PeriodicDomainService,
    // Application Services
    CategoryApplicationService,
    TransactionApplicationService,
    TagApplicationService,
    PeriodicApplicationService,
  ],
  exports: [
    CategoryApplicationService,
    TransactionApplicationService,
    TagApplicationService,
    PeriodicApplicationService,
  ],
})
export class ApplicationModule {}
