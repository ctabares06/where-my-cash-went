import { CategoryEntity, CategoryProps } from '../entities/category.entity';
import { ICategoryRepository } from '../ports/category.repository.port';
import {
  NotFoundDomainException,
  ValidationDomainException,
} from '../../shared/errors/domain.exception';
import { CategoryAlreadyExistsException } from '../errors/category.errors';
import { DomainService } from '../../base/domain-service';
import { Transaction_T } from '../../../lib/ormClient/enums';

export type CreateCategoryInput = {
  name: string;
  unicode: string;
  transactionType: Transaction_T;
};

export type UpdateCategoryInput = {
  name?: string;
  unicode?: string;
};

/**
 * Category Domain Service - Pure business logic, no framework dependencies
 */
export class CategoriesDomainService extends DomainService {
  constructor(private readonly categoryRepository: ICategoryRepository) {
    super();
  }

  async create(
    input: CreateCategoryInput,
    userId: string,
  ): Promise<CategoryProps> {
    // Check for duplicate name per user
    const existing = await this.categoryRepository.findByNameAndUserId(
      input.name,
      userId,
    );
    if (existing) {
      throw new CategoryAlreadyExistsException(input.name);
    }

    const entity = CategoryEntity.createNew({
      name: input.name,
      unicode: input.unicode,
      transactionType: input.transactionType,
      userId,
    });

    return this.categoryRepository.create(entity);
  }

  async createMany(
    inputs: CreateCategoryInput[],
    userId: string,
  ): Promise<CategoryProps[]> {
    const entities: CategoryEntity[] = [];

    for (const input of inputs) {
      // Check for duplicate name per user
      const existing = await this.categoryRepository.findByNameAndUserId(
        input.name,
        userId,
      );
      if (existing) {
        throw new CategoryAlreadyExistsException(input.name);
      }
      entities.push(
        CategoryEntity.createNew({
          name: input.name,
          unicode: input.unicode,
          transactionType: input.transactionType,
          userId,
        }),
      );
    }

    return this.categoryRepository.createMany(entities);
  }

  async getById(id: string, userId: string): Promise<CategoryEntity> {
    const entity = await this.categoryRepository.findByIdAndUserId(id, userId);

    if (!entity) {
      throw new NotFoundDomainException('Category', id);
    }

    return entity;
  }

  async getManyByUser(
    userId: string,
    limit: number,
    page: number,
  ): Promise<CategoryEntity[]> {
    if (limit < 1) {
      throw new ValidationDomainException('Limit must be positive');
    }
    if (page < 0) {
      throw new ValidationDomainException('Page cannot be negative');
    }

    return this.categoryRepository.findManyByUserId(userId, limit, page);
  }

  async update(
    id: string,
    input: UpdateCategoryInput,
    userId: string,
  ): Promise<CategoryEntity> {
    const existing = await this.categoryRepository.findByIdAndUserId(
      id,
      userId,
    );

    if (!existing) {
      throw new NotFoundDomainException('Category', id);
    }

    // Check for duplicate name if updating name
    if (input.name && input.name !== existing.name) {
      const duplicate = await this.categoryRepository.findByNameAndUserId(
        input.name,
        userId,
      );
      if (duplicate) {
        throw new CategoryAlreadyExistsException(input.name);
      }
    }

    let updated = existing;
    if (input.name) {
      updated = updated.updateName(input.name);
    }
    if (input.unicode) {
      updated = updated.updateUnicode(input.unicode);
    }

    await this.categoryRepository.update(updated);
    return updated;
  }

  async delete(id: string, userId: string): Promise<void> {
    const existing = await this.categoryRepository.findByIdAndUserId(
      id,
      userId,
    );

    if (!existing) {
      throw new NotFoundDomainException('Category', id);
    }

    await this.categoryRepository.delete(id, userId);
  }

  async count(userId: string): Promise<number> {
    return this.categoryRepository.countByUserId(userId);
  }
}
