import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTagDto, UpdateTagDto } from './tags.dto';
import { Prisma } from '../lib/ormClient/client';

export type CreateTagDomain = Prisma.TagsCreateInput;
export type UpdateTagDomain = Prisma.TagsUpdateInput;

const tagSelect = {
  id: true,
  name: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TagsSelect;

export type TagSelectPayload = Prisma.TagsGetPayload<{
  select: typeof tagSelect;
}>;

@Injectable()
export class TagsDomain {
  constructor(private dbService: DatabaseService) {}

  create(data: CreateTagDto, userId: string) {
    const tagsInput: CreateTagDomain = {
      name: data.name,
      user: {
        connect: {
          id: userId,
        },
      },
    };

    return this.dbService.tags().create({
      data: tagsInput,
    });
  }

  getOne(id: string, userId: string) {
    return this.dbService.tags().findFirstOrThrow({
      where: {
        id,
        userId,
      },
      select: tagSelect,
    });
  }

  getMany(userId: string, limit: number, page: number) {
    return this.dbService.tags().findMany({
      where: {
        userId,
      },
      take: limit,
      skip: page,
      select: tagSelect,
    });
  }

  async update(data: UpdateTagDto, tagId: string, userId: string) {
    const tagsInput: UpdateTagDomain = {
      name: data.name,
    };

    return this.dbService.tags().update({
      where: {
        id: tagId,
        userId: userId,
      },
      data: tagsInput,
    });
  }

  delete(id: string, userId: string) {
    return this.dbService.tags().delete({
      where: {
        id,
        userId,
      },
    });
  }
}
