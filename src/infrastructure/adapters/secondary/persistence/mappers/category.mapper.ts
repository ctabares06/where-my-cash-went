import { CategoryEntity } from '@/domains/categories/entities/category.entity';
import { Category } from '@/lib/ormClient/client';

export class CategoryMapper {
  static toDomain(entity: Category): CategoryEntity {
    return CategoryEntity.create({
      id: entity.id,
      name: entity.name,
      unicode: entity.unicode,
      transactionType: entity.transactionType,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toDomainList(entities: Category[]): CategoryEntity[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  static toProps(entity: CategoryEntity): Omit<Category, never> {
    return {
      id: entity.id,
      name: entity.name,
      unicode: entity.unicode,
      transactionType: entity.transactionType,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    } as Omit<Category, never>;
  }
}
