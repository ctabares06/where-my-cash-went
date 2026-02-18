import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth';
import { DatabaseModule } from './database/database.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionModule } from './transaction/transaction.module';
import { GenericModule } from './periodic/periodic.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule.forRoot({ auth, isGlobal: true }),
    CategoriesModule,
    TagsModule,
    TransactionModule,
    GenericModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
