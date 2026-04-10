import { Injectable } from '@nestjs/common';
import { TagsDomainService } from '@/domains/tags/domain/tags.domain.service';
import { CreateTagDto } from '@/applications/tags/dtos/create-tag.dto';
import { UpdateTagDto } from '@/applications/tags/dtos/update-tag.dto';
import {
  TagResponseDto,
  TagListResponseDto,
} from '@/applications/tags/dtos/tag-response.dto';

/**
 * Tag Application Service - Use case orchestration
 */
@Injectable()
export class TagApplicationService {
  constructor(private readonly tagDomainService: TagsDomainService) {}

  async create(
    input: CreateTagDto | CreateTagDto[],
    userId: string,
  ): Promise<TagResponseDto> {
    if (Array.isArray(input)) {
      const results = await this.tagDomainService.createMany(
        input.map((dto) => ({ name: dto.name })),
        userId,
      );
      return {
        data: results,
        count: results.length,
      };
    }

    const result = await this.tagDomainService.create(
      { name: input.name },
      userId,
    );
    return {
      data: [result],
      count: 1,
    };
  }

  async getById(id: string, userId: string): Promise<TagResponseDto> {
    const result = await this.tagDomainService.getById(id, userId);
    return {
      data: [result.toProps()],
      count: 1,
    };
  }

  async getMany(
    userId: string,
    page: number,
    limit: number,
  ): Promise<TagListResponseDto> {
    const results = await this.tagDomainService.getManyByUser(
      userId,
      limit,
      page,
    );
    return {
      data: results.map((e) => e.toProps()),
      page,
      limit,
      count: results.length,
    };
  }

  async update(
    id: string,
    input: UpdateTagDto,
    userId: string,
  ): Promise<TagResponseDto> {
    const result = await this.tagDomainService.update(
      id,
      { name: input.name! },
      userId,
    );
    return {
      data: [result.toProps()],
      count: 1,
    };
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.tagDomainService.delete(id, userId);
  }
}
