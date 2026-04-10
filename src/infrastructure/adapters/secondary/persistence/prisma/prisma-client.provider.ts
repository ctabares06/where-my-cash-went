import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@/lib/ormClient/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Sql } from '@prisma/client/runtime/client';

@Injectable()
export class PrismaClientProvider implements OnModuleInit, OnModuleDestroy {
  private readonly client: PrismaClient;

  constructor(configVars: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: configVars.getOrThrow('DATABASE_URL'),
    });

    this.client = new PrismaClient({ adapter });
  }

  get category() {
    return this.client.category;
  }

  get transaction() {
    return this.client.transaction;
  }

  get tags() {
    return this.client.tags;
  }

  get tagsOnTransactions() {
    return this.client.tagsOnTransactions;
  }

  get periodic() {
    return this.client.periodic;
  }

  $queryRaw(query: TemplateStringsArray | Sql, ...rest: any[]) {
    return this.client.$queryRaw(query, rest);
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
