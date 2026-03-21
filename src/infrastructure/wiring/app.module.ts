import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '../../lib/auth';
import { PrimaryAdapterModule } from './primary-adapter.module';
import { InfrastructureModule } from './infrastructure.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.forRoot({ auth, isGlobal: true }),
    InfrastructureModule,
    PrimaryAdapterModule,
  ],
})
export class AppModule {}
