import { Entity } from '@/domains/base/entity';
import { Transaction_T } from '@/lib/ormClient/enums';

/**
 * Transaction Entity - Pure domain object, no framework dependencies
 */
export type TransactionProps = {
  id: string;
  quantity: number;
  description: string;
  userId: string;
  categoryId: string | null;
  transactionType: Transaction_T | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionWithRelations = TransactionProps & {
  category?: { id: string; name: string } | null;
  tags?: Array<{ id: string; name: string }>;
};

export class TransactionEntity extends Entity<string> {
  private constructor(
    id: string,
    private props: Omit<TransactionProps, 'id'>,
  ) {
    super(id);
  }

  static create(props: TransactionProps): TransactionEntity {
    return new TransactionEntity(props.id, props);
  }

  static createNew(
    props: Omit<TransactionProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): TransactionEntity {
    return TransactionEntity.create({
      id: crypto.randomUUID(),
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Getters
  get quantity(): number {
    return this.props.quantity;
  }
  get description(): string {
    return this.props.description;
  }
  get userId(): string {
    return this.props.userId;
  }
  get categoryId(): string | null {
    return this.props.categoryId;
  }
  get transactionType(): Transaction_T | null {
    return this.props.transactionType;
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

  hasCategory(): boolean {
    return this.props.categoryId !== null;
  }

  isIncome(): boolean {
    return this.props.transactionType === Transaction_T.income;
  }

  isExpense(): boolean {
    return this.props.transactionType === Transaction_T.expense;
  }

  updateQuantity(quantity: number): TransactionEntity {
    return TransactionEntity.create({
      ...this.toProps(),
      quantity,
      updatedAt: new Date(),
    });
  }

  updateDescription(description: string): TransactionEntity {
    return TransactionEntity.create({
      ...this.toProps(),
      description,
      updatedAt: new Date(),
    });
  }

  setCategory(categoryId: string | null): TransactionEntity {
    return TransactionEntity.create({
      ...this.toProps(),
      categoryId,
      transactionType: null, // Category takes precedence
      updatedAt: new Date(),
    });
  }

  toProps(): TransactionProps {
    return {
      id: this.id,
      ...this.props,
    };
  }
}
