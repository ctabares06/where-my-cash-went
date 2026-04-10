import { Entity } from '@/domains/base/entity';
import { Cycle_T } from '@/lib/ormClient/enums';

/**
 * Periodic Entity - Pure domain object, no framework dependencies
 * Represents a recurring transaction template
 */
export type PeriodicProps = {
  id: string;
  transactionId: string;
  cycle: Cycle_T;
  duration: number | null;
  nextOcurrence: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type PeriodicWithTransactionProps = PeriodicProps & {
  transaction: {
    id: string;
    quantity: number;
    description: string;
    userId: string;
    tagsOnTransactions: Array<{ tagId: string; transactionId: string }>;
  };
};

export class PeriodicEntity extends Entity<string> {
  private constructor(
    id: string,
    private props: Omit<PeriodicProps, 'id'>,
  ) {
    super(id);
  }

  static create(props: PeriodicProps): PeriodicEntity {
    return new PeriodicEntity(props.id, props);
  }

  static createNew(
    props: Omit<PeriodicProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): PeriodicEntity {
    return PeriodicEntity.create({
      id: crypto.randomUUID(),
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Getters
  get transactionId(): string {
    return this.props.transactionId;
  }
  get cycle(): Cycle_T {
    return this.props.cycle;
  }
  get duration(): number | null {
    return this.props.duration;
  }
  get nextOcurrence(): Date {
    return this.props.nextOcurrence;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business logic
  isDue(currentDate: Date): boolean {
    return this.props.nextOcurrence <= currentDate;
  }

  calculateNextOccurrence(fromDate?: Date): Date {
    const lastOccurrence = fromDate ?? this.props.nextOcurrence;
    const next = new Date(lastOccurrence);

    switch (this.props.cycle) {
      case Cycle_T.daily:
        next.setDate(next.getDate() + 1);
        break;
      case Cycle_T.weekly:
        next.setDate(next.getDate() + 7);
        break;
      case Cycle_T.fortnightly:
        next.setDate(next.getDate() + 14);
        break;
      case Cycle_T.monthly:
        next.setMonth(next.getMonth() + 1);
        break;
      case Cycle_T.quarterly:
        next.setMonth(next.getMonth() + 3);
        break;
      case Cycle_T.biannual:
        next.setMonth(next.getMonth() + 6);
        break;
      case Cycle_T.yearly:
        next.setFullYear(next.getFullYear() + 1);
        break;
      case Cycle_T.custom:
        if (this.props.duration === null || this.props.duration <= 1) {
          throw new Error('Duration is required for custom cycles');
        }
        next.setDate(next.getDate() + this.props.duration);
        break;
    }

    return next;
  }

  updateCycle(cycle: Cycle_T, duration?: number): PeriodicEntity {
    return PeriodicEntity.create({
      ...this.toProps(),
      cycle,
      duration:
        cycle === Cycle_T.custom ? (duration ?? this.props.duration) : null,
      updatedAt: new Date(),
    });
  }

  advanceToNextOccurrence(): PeriodicEntity {
    const next = this.calculateNextOccurrence();
    return PeriodicEntity.create({
      ...this.toProps(),
      nextOcurrence: next,
      updatedAt: new Date(),
    });
  }

  toProps(): PeriodicProps {
    return {
      id: this.id,
      ...this.props,
    };
  }
}
