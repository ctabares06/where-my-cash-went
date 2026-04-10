import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@/infrastructure/wiring/infrastructure.module';
import { CategoriesDomainService } from '@/domains/categories/domain/categories.domain.service';
import { TransactionsDomainService } from '@/domains/transactions/domain/transactions.domain.service';
import { TagsDomainService } from '@/domains/tags/domain/tags.domain.service';
import { PeriodicDomainService } from '@/domains/periodic/domain/periodic.domain.service';
import { HealthDomainService } from '@/domains/health/domain/health.domain-service';

@Module({
  imports: [InfrastructureModule],
  providers: [
    CategoriesDomainService,
    TransactionsDomainService,
    TagsDomainService,
    PeriodicDomainService,
    HealthDomainService,
  ],
  exports: [
    CategoriesDomainService,
    TransactionsDomainService,
    TagsDomainService,
    PeriodicDomainService,
    HealthDomainService,
  ],
})
export class DomainModule {}
