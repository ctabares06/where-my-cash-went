import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateTagDto, UpdateTagDto } from './tags.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Post()
  async createTag(@Body() body: CreateTagDto, @Session() session: UserSession) {
    return await this.tagsService.createTag(body, session.user.id);
  }

  @Get()
  async getTags(
    @Session() session: UserSession,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.tagsService.getTagsByUser(session.user.id, page, limit);
  }

  @Get(':id')
  async getTagById(
    @Param('id') tagId: string,
    @Session() session: UserSession,
  ) {
    return await this.tagsService.getTagById(tagId, session.user.id);
  }

  @Put(':id')
  async updateTag(
    @Param('id') tagId: string,
    @Body() body: UpdateTagDto,
    @Session() session: UserSession,
  ) {
    return await this.tagsService.updateTag(body, tagId, session.user.id);
  }

  @Delete(':id')
  async deleteTag(@Param('id') tagId: string, @Session() session: UserSession) {
    return await this.tagsService.deleteTag(tagId, session.user.id);
  }
}
