import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';
import { CategoriesDomain } from './categories.domain';

@Injectable()
export class CategoriesService {
  constructor(private categoryDomain: CategoriesDomain) {}

  createCategory(
    body: CreateCategoryDto | CreateCategoryDto[],
    userId: string,
  ) {
    if (Array.isArray(body)) {
      const createCategoriesPromises = body.map((batch) =>
        this.categoryDomain.create(batch, userId),
      );

      return Promise.all(createCategoriesPromises);
    }

    return this.categoryDomain.create(body, userId);
  }

  async getCategoriesByUser(userId: string, page: number, limit: number) {
    return this.categoryDomain.getMany(userId, limit, page);
  }

  async getCategoryById(categoryId: string, userId: string) {
    return this.categoryDomain.getOne(categoryId, userId);
  }

  async updateCategory(
    body: UpdateCategoryDto,
    categoryId: string,
    userId: string,
  ) {
    return this.categoryDomain.update(body, categoryId, userId);
  }

  async deleteCategory(categoryId: string, userId: string) {
    return this.categoryDomain.delete(categoryId, userId);
  }
}
