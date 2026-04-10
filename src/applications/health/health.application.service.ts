import { Injectable } from '@nestjs/common';
import {
  HealthDomainService,
  HealthCheckResult,
} from '@/domains/health/domain/health.domain-service';

@Injectable()
export class HealthApplicationService {
  constructor(private readonly healthDomainService: HealthDomainService) {}

  async checkHealth(): Promise<HealthCheckResult> {
    return this.healthDomainService.checkHealth();
  }
}
