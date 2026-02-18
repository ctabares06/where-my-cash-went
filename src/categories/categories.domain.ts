import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '../lib/ormClient/client';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

@Injectable()
export class CategoriesDomain {
  constructor(private dbService: DatabaseService) {}

  create(data: CreateCategoryDto, userId: string) {
    const tagsInput: Prisma.CategoryCreateInput = {
      ...data,
      user: {
        connect: {
          id: userId,
        },
      },
    };

    return this.dbService.category().create({
      data: tagsInput,
    });
  }

  getOne(id: string, userId: string) {
    return this.dbService.category().findFirstOrThrow({
      where: {
        id,
        userId,
      },
    });
  }

  getMany(userId: string, limit: number, page: number) {
    return this.dbService.category().findMany({
      where: {
        userId,
      },
      take: limit,
      skip: page,
    });
  }

  async update(data: UpdateCategoryDto, tagId: string, userId: string) {
    const categoryInput: Prisma.CategoryUpdateInput = {
      ...data,
    };

    return this.dbService.category().update({
      where: {
        id: tagId,
        userId: userId,
      },
      data: categoryInput,
    });
  }

  delete(id: string, userId: string) {
    return this.dbService.category().delete({
      where: {
        id,
        userId,
      },
    });
  }
}
