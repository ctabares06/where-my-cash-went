import { Injectable } from '@nestjs/common';
import { IHealthCheckPort } from '@/domains/health/ports/health-check.port';
import { PrismaClientProvider } from '@/infrastructure/adapters/secondary/persistence/prisma/prisma-client.provider';

@Injectable()
export class HealthRepository implements IHealthCheckPort {
  constructor(private readonly prisma: PrismaClientProvider) {}

  async isDatabaseConnected(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
