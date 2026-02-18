import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTagDto, UpdateTagDto } from './tags.dto';
import { Prisma } from '../lib/ormClient/client';

@Injectable()
export class TagsDomain {
  constructor(private dbService: DatabaseService) {}

  create(data: CreateTagDto, userId: string) {
    const tagsInput: Prisma.TagsCreateInput = {
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
    });
  }

  getMany(userId: string, limit: number, page: number) {
    return this.dbService.tags().findMany({
      where: {
        userId,
      },
      take: limit,
      skip: page,
    });
  }

  async update(data: UpdateTagDto, tagId: string, userId: string) {
    const tagsInput: Prisma.TagsUpdateInput = {
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
