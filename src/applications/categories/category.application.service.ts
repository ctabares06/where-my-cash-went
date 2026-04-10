import { CategoriesDomainService } from '@/domains/categories/domain/categories.domain.service';
import { CreateCategoryDto } from '@/applications/categories/dtos/create-category.dto';
import { UpdateCategoryDto } from '@/applications/categories/dtos/update-category.dto';
import {
  CategoryResponseDto,
  CategoryListResponseDto,
} from '@/applications/categories/dtos/category-response.dto';
import { Injectable } from '@nestjs/common';

/**
 * Category Application Service - Use case orchestration
 * Depends on domain services, not on infrastructure
 */

@Injectable()
export class CategoryApplicationService {
  constructor(
    private readonly categoryDomainService: CategoriesDomainService,
  ) {}

  async create(
    input: CreateCategoryDto | CreateCategoryDto[],
    userId: string,
  ): Promise<CategoryResponseDto> {
    if (Array.isArray(input)) {
      const results = await this.categoryDomainService.createMany(
        input.map((dto) => ({
          name: dto.name,
          unicode: dto.unicode,
          transactionType: dto.transactionType,
        })),
        userId,
      );
      return {
        data: results,
        count: results.length,
      };
    }

    const result = await this.categoryDomainService.create(
      {
        name: input.name,
        unicode: input.unicode,
        transactionType: input.transactionType,
      },
      userId,
    );
    return {
      data: [result],
      count: 1,
    };
  }

  async getById(id: string, userId: string): Promise<CategoryResponseDto> {
    const result = await this.categoryDomainService.getById(id, userId);
    return {
      data: [result.toProps()],
      count: 1,
    };
  }

  async getMany(
    userId: string,
    page: number,
    limit: number,
  ): Promise<CategoryListResponseDto> {
    const results = await this.categoryDomainService.getManyByUser(
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
    input: UpdateCategoryDto,
    userId: string,
  ): Promise<CategoryResponseDto> {
    const result = await this.categoryDomainService.update(id, input, userId);
    return {
      data: [result.toProps()],
      count: 1,
    };
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.categoryDomainService.delete(id, userId);
  }
}
