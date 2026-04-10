import { Module } from '@nestjs/common';
import { DomainModule } from '@/infrastructure/wiring/domain.module';
import { CategoryApplicationService } from '@/applications/categories/category.application.service';
import { TransactionApplicationService } from '@/applications/transactions/transaction.application.service';
import { TagApplicationService } from '@/applications/tags/tag.application.service';
import { PeriodicApplicationService } from '@/applications/periodic/periodic.application.service';
import { HealthApplicationService } from '@/applications/health/health.application.service';

@Module({
  imports: [DomainModule],
  providers: [
    // Application Services
    CategoryApplicationService,
    TransactionApplicationService,
    TagApplicationService,
    PeriodicApplicationService,
    HealthApplicationService,
  ],
  exports: [
    CategoryApplicationService,
    TransactionApplicationService,
    TagApplicationService,
    PeriodicApplicationService,
    HealthApplicationService,
  ],
})
export class ApplicationModule {}
