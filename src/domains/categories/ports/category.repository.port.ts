import {
  CategoryEntity,
  CategoryProps,
} from '@/domains/categories/entities/category.entity';

/**
 * Category Repository Port - Interface defined in domain
 * Implementation will be in infrastructure layer (Prisma adapter)
 */
export interface ICategoryRepository {
  create(entity: CategoryEntity): Promise<CategoryProps>;
  createMany(entities: CategoryEntity[]): Promise<CategoryProps[]>;
  findById(id: string): Promise<CategoryEntity | null>;
  findByIdAndUserId(id: string, userId: string): Promise<CategoryEntity | null>;
  findManyByUserId(
    userId: string,
    limit: number,
    page: number,
  ): Promise<CategoryEntity[]>;
  findByNameAndUserId(
    name: string,
    userId: string,
  ): Promise<CategoryEntity | null>;
  update(entity: CategoryEntity): Promise<CategoryProps>;
  delete(id: string, userId: string): Promise<CategoryProps>;
  countByUserId(userId: string): Promise<number>;
}
