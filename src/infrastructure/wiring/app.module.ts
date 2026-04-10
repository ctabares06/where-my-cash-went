import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@/lib/auth';
import { PrimaryAdapterModule } from '@/infrastructure/wiring/primary-adapter.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.forRoot({ auth, isGlobal: true }),
    PrimaryAdapterModule,
  ],
})
export class AppModule {}
