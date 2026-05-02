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
    let isDbConnected = false;

    try {
      isDbConnected = await this.healthCheckPort.isDatabaseConnected();
      if (isDbConnected) {
        console.log('[HealthCheck] Database connection: OK - SELECT 1 query executed successfully');
      } else {
        console.log('[HealthCheck] Database connection: FAILED - Query returned false, database may be unreachable');
      }
    } catch (error) {
      let dbErrorMessage = error instanceof Error ? error.message : String(error);
      console.log(`[HealthCheck] Database connection: ERROR - ${dbErrorMessage}`);
    }

    const result: HealthCheckResult = {
      status: isDbConnected ? 'ok' : 'error',
      database: isDbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };

    console.log(`[HealthCheck] Final status: ${result.status} | Database: ${result.database} | Timestamp: ${result.timestamp}`);

    return result;
  }
}
