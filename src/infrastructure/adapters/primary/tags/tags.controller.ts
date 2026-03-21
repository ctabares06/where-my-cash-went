import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Session,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TagApplicationService } from '../../../../applications/tags/tag.application.service';
import { CreateTagDto } from '../../../../applications/tags/dtos/create-tag.dto';
import { UpdateTagDto } from '../../../../applications/tags/dtos/update-tag.dto';
import { TagListResponseDto } from '../../../../applications/tags/dtos/tag-response.dto';
import type { UserSession } from '../../../../lib/auth.types';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagAppService: TagApplicationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTag(
    @Body() body: CreateTagDto | CreateTagDto[],
    @Session() session: UserSession,
  ) {
    return this.tagAppService.create(body, session.user.id);
  }

  @Get()
  async getTags(
    @Session() session: UserSession,
    @Query('page') page: string = '0',
    @Query('limit') limit: string = '10',
  ): Promise<TagListResponseDto> {
    return this.tagAppService.getMany(
      session.user.id,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get(':id')
  async getTagById(
    @Param('id') tagId: string,
    @Session() session: UserSession,
  ) {
    return this.tagAppService.getById(tagId, session.user.id);
  }

  @Put(':id')
  async updateTag(
    @Param('id') tagId: string,
    @Body() body: UpdateTagDto,
    @Session() session: UserSession,
  ) {
    return this.tagAppService.update(tagId, body, session.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTag(
    @Param('id') tagId: string,
    @Session() session: UserSession,
  ): Promise<void> {
    await this.tagAppService.delete(tagId, session.user.id);
  }
}
