import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../../../../../lib/ormClient/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaClientProvider implements OnModuleInit, OnModuleDestroy {
  private readonly client: PrismaClient;

  constructor(configVars: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: configVars.getOrThrow('DATABASE_URL'),
    });

    this.client = new PrismaClient({ adapter });
  }

  category() {
    return this.client.category satisfies typeof this.client.category;
  }

  transaction() {
    return this.client.transaction;
  }

  periodic() {
    return this.client.periodic;
  }

  tags() {
    return this.client.tags;
  }

  user() {
    return this.client.user;
  }

  tagsOnTransactions() {
    return this.client.tagsOnTransactions;
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
