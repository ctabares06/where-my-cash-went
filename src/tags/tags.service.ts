import { Injectable } from '@nestjs/common';
import { CreateTagDto, UpdateTagDto } from './tags.dto';
import { TagsDomain } from './tags.domain';

@Injectable()
export class TagsService {
  constructor(private tagsDomain: TagsDomain) {}

  async createTag(body: CreateTagDto | CreateTagDto[], userId: string) {
    if (Array.isArray(body)) {
      const createTagsPromise = body.map((batch) =>
        this.tagsDomain.create(batch, userId),
      );

      return await Promise.all(createTagsPromise);
    }

    return this.tagsDomain.create(body, userId);
  }

  getTagsByUser(userId: string, page: number, limit: number) {
    return this.tagsDomain.getMany(userId, limit, page);
  }

  getTagById(tagId: string, userId: string) {
    return this.tagsDomain.getOne(tagId, userId);
  }

  async updateTag(body: UpdateTagDto, tagId: string, userId: string) {
    return this.tagsDomain.update(body, tagId, userId);
  }

  async deleteTag(tagId: string, userId: string) {
    return this.tagsDomain.delete(tagId, userId);
  }
}
