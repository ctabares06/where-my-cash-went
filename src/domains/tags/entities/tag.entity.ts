import { Entity } from '../../base/entity';

/**
 * Tag Entity - Pure domain object, no framework dependencies
 */
export type TagProps = {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export class TagEntity extends Entity<string> {
  private constructor(
    id: string,
    private props: Omit<TagProps, 'id'>,
  ) {
    super(id);
  }

  static create(props: TagProps): TagEntity {
    return new TagEntity(props.id, props);
  }

  static createNew(
    props: Omit<TagProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): TagEntity {
    return TagEntity.create({
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

  updateName(name: string): TagEntity {
    return TagEntity.create({
      ...this.toProps(),
      name,
      updatedAt: new Date(),
    });
  }

  toProps(): TagProps {
    return {
      id: this.id,
      ...this.props,
    };
  }
}
