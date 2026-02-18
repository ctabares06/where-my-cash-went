import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DatabaseService } from 'src/database/database.service';
import { CategoriesDomain } from './categories.domain';

@Module({
  providers: [CategoriesService, CategoriesDomain, DatabaseService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
