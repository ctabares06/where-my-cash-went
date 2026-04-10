import { ICategoryRepository } from '@/domains/categories/ports/category.repository.port';
import {
  CategoryEntity,
  CategoryProps,
} from '@/domains/categories/entities/category.entity';
import { CategoryMapper } from '@/infrastructure/adapters/secondary/persistence/mappers/category.mapper';
import { PrismaClientProvider } from '@/infrastructure/adapters/secondary/persistence/prisma/prisma-client.provider';
import { Injectable } from '@nestjs/common';

const categorySelect = {
  id: true,
  name: true,
  unicode: true,
  transactionType: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaClientProvider) {}

  async create(entity: CategoryEntity): Promise<CategoryProps> {
    const data = CategoryMapper.toProps(entity);
    const result = await this.prisma.category.create({ data });
    return result;
  }

  async createMany(entities: CategoryEntity[]): Promise<CategoryProps[]> {
    const data = entities.map((e) => CategoryMapper.toProps(e));
    const results = await this.prisma.category.createManyAndReturn({ data });
    return results;
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const result = await this.prisma.category.findUnique({
      where: { id },
      select: categorySelect,
    });
    if (!result) return null;
    return CategoryMapper.toDomain(result);
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<CategoryEntity | null> {
    const result = await this.prisma.category.findFirst({
      where: { id, userId },
      select: categorySelect,
    });
    if (!result) return null;
    return CategoryMapper.toDomain(result);
  }

  async findManyByUserId(
    userId: string,
    limit: number,
    page: number,
  ): Promise<CategoryEntity[]> {
    const results = await this.prisma.category.findMany({
      where: { userId },
      select: categorySelect,
      skip: page * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return CategoryMapper.toDomainList(results);
  }

  async findByNameAndUserId(
    name: string,
    userId: string,
  ): Promise<CategoryEntity | null> {
    const result = await this.prisma.category.findFirst({
      where: { name, userId },
      select: categorySelect,
    });
    if (!result) return null;
    return CategoryMapper.toDomain(result);
  }

  async update(entity: CategoryEntity): Promise<CategoryProps> {
    const data = CategoryMapper.toProps(entity);
    const result = await this.prisma.category.update({
      where: { id: entity.id },
      data,
    });
    return result;
  }

  async delete(id: string, userId: string): Promise<CategoryProps> {
    const result = await this.prisma.category.delete({
      where: { id, userId },
    });
    return result;
  }

  async countByUserId(userId: string): Promise<number> {
    return this.prisma.category.count({ where: { userId } });
  }
}
