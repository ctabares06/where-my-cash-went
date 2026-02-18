import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TagsDomain } from './tags.domain';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [TagsService, TagsDomain, DatabaseService],
  controllers: [TagsController],
})
export class TagsModule {}
