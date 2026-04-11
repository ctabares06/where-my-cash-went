import { Inject, Injectable } from '@nestjs/common';
import { DomainService } from '@/domains/base/domain-service';
import type { IHealthCheckPort } from '@/domains/health/ports/health-check.port';
import { HEALTH_CHECK_PORT } from '@/infrastructure/wiring/tokens';

export type HealthCheckResult = {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  timestamp: string;
};

@Injectable()
export class HealthDomainService extends DomainService {
  constructor(
    @Inject(HEALTH_CHECK_PORT)
    private readonly healthCheckPort: IHealthCheckPort,
  ) {
    super();
  }

  async checkHealth(): Promise<HealthCheckResult> {
    const isDbConnected = await this.healthCheckPort.isDatabaseConnected();
    console.log(isDbConnected);

    return {
      status: isDbConnected ? 'ok' : 'error',
      database: isDbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
}
