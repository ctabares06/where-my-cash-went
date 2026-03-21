import { TagEntity } from '../../../../../domains/tags/entities/tag.entity';
import { Tags } from '../../../../../lib/ormClient/client';

export class TagMapper {
  static toDomain(entity: Tags): TagEntity {
    return TagEntity.create({
      id: entity.id,
      name: entity.name,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toDomainList(entities: Tags[]): TagEntity[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  static toProps(entity: TagEntity): Omit<Tags, never> {
    return {
      id: entity.id,
      name: entity.name,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    } as Omit<Tags, never>;
  }
}
