import { Inject, Injectable } from '@nestjs/common';
import { TagEntity, TagProps } from '@/domains/tags/entities/tag.entity';
import type { ITagRepository } from '@/domains/tags/ports/tag.repository.port';
import {
  NotFoundDomainException,
  ValidationDomainException,
} from '@/domains/shared/errors/domain.exception';
import { TagAlreadyExistsException } from '@/domains/tags/errors/tag.errors';
import { DomainService } from '@/domains/base/domain-service';
import { TAG_REPOSITORY } from '@/infrastructure/wiring/tokens';

export type CreateTagInput = {
  name: string;
};

export type UpdateTagInput = {
  name: string;
};

/**
 * Tag Domain Service - Pure business logic, no framework dependencies
 */
@Injectable()
export class TagsDomainService extends DomainService {
  constructor(
    @Inject(TAG_REPOSITORY) private readonly tagRepository: ITagRepository,
  ) {
    super();
  }

  async create(input: CreateTagInput, userId: string): Promise<TagProps> {
    // Check for duplicate name per user
    const existing = await this.tagRepository.findByNameAndUserId(
      input.name,
      userId,
    );
    if (existing) {
      throw new TagAlreadyExistsException(input.name);
    }

    const entity = TagEntity.createNew({
      name: input.name,
      userId,
    });

    return this.tagRepository.create(entity);
  }

  async createMany(
    inputs: CreateTagInput[],
    userId: string,
  ): Promise<TagProps[]> {
    const entities: TagEntity[] = [];

    for (const input of inputs) {
      // Check for duplicate name per user
      const existing = await this.tagRepository.findByNameAndUserId(
        input.name,
        userId,
      );
      if (existing) {
        throw new TagAlreadyExistsException(input.name);
      }
      entities.push(
        TagEntity.createNew({
          name: input.name,
          userId,
        }),
      );
    }

    return this.tagRepository.createMany(entities);
  }

  async getById(id: string, userId: string): Promise<TagEntity> {
    const entity = await this.tagRepository.findByIdAndUserId(id, userId);

    if (!entity) {
      throw new NotFoundDomainException('Tag', id);
    }

    return entity;
  }

  async getManyByUser(
    userId: string,
    limit: number,
    page: number,
  ): Promise<TagEntity[]> {
    if (limit < 1) {
      throw new ValidationDomainException('Limit must be positive');
    }
    if (page < 0) {
      throw new ValidationDomainException('Page cannot be negative');
    }

    return this.tagRepository.findManyByUserId(userId, limit, page);
  }

  async update(
    id: string,
    input: UpdateTagInput,
    userId: string,
  ): Promise<TagEntity> {
    const existing = await this.tagRepository.findByIdAndUserId(id, userId);

    if (!existing) {
      throw new NotFoundDomainException('Tag', id);
    }

    // Check for duplicate name if updating name
    if (input.name !== existing.name) {
      const duplicate = await this.tagRepository.findByNameAndUserId(
        input.name,
        userId,
      );
      if (duplicate) {
        throw new TagAlreadyExistsException(input.name);
      }
    }

    const updated = existing.updateName(input.name);
    await this.tagRepository.update(updated);
    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    const existing = await this.tagRepository.findByIdAndUserId(id, userId);

    if (!existing) {
      throw new NotFoundDomainException('Tag', id);
    }

    await this.tagRepository.delete(id, userId);
  }

  async count(userId: string): Promise<number> {
    return this.tagRepository.countByUserId(userId);
  }
}
