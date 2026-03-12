import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '../lib/ormClient/client';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

export type CreateCategoryDomain = Prisma.CategoryCreateInput;
export type UpdateCategoryDomain = Prisma.CategoryUpdateInput;

// selects used for read operations
const categorySelect = {
  id: true,
  name: true,
  unicode: true,
  transactionType: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CategorySelect;

export type CategorySelectPayload = Prisma.CategoryGetPayload<{
  select: typeof categorySelect;
}>;

@Injectable()
export class CategoriesDomain {
  constructor(private dbService: DatabaseService) {}

  create(data: CreateCategoryDto, userId: string) {
    const tagsInput: CreateCategoryDomain = {
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
      select: categorySelect,
    });
  }

  getMany(userId: string, limit: number, page: number) {
    return this.dbService.category().findMany({
      where: {
        userId,
      },
      take: limit,
      skip: page,
      select: categorySelect,
    });
  }

  async update(data: UpdateCategoryDto, tagId: string, userId: string) {
    const categoryInput: UpdateCategoryDomain = {
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
