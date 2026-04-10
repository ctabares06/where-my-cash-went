import { Entity } from '@/domains/base/entity';
import { Transaction_T } from '@/lib/ormClient/enums';

/**
 * Category Entity - Pure domain object, no framework dependencies
 */
export type CategoryProps = {
  id: string;
  name: string;
  unicode: string;
  transactionType: Transaction_T;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export class CategoryEntity extends Entity<string> {
  private constructor(
    id: string,
    private props: Omit<CategoryProps, 'id'>,
  ) {
    super(id);
  }

  static create(props: CategoryProps): CategoryEntity {
    return new CategoryEntity(props.id, {
      name: props.name,
      unicode: props.unicode,
      transactionType: props.transactionType,
      userId: props.userId,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  static createNew(
    props: Omit<CategoryProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): CategoryEntity {
    return CategoryEntity.create({
      id: crypto.randomUUID(),
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Getters
  get name(): string {
    return this.props.name;
  }
  get unicode(): string {
    return this.props.unicode;
  }
  get transactionType(): Transaction_T {
    return this.props.transactionType;
  }
  get userId(): string {
    return this.props.userId;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business logic
  belongsToUser(userId: string): boolean {
    return this.props.userId === userId;
  }

  updateName(name: string): CategoryEntity {
    return CategoryEntity.create({
      ...this.toProps(),
      name,
      updatedAt: new Date(),
    });
  }

  updateUnicode(unicode: string): CategoryEntity {
    return CategoryEntity.create({
      ...this.toProps(),
      unicode,
      updatedAt: new Date(),
    });
  }

  toProps(): CategoryProps {
    return {
      id: this.id,
      ...this.props,
    };
  }
}
