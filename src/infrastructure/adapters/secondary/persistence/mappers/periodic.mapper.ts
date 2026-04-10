import { PeriodicEntity } from '@/domains/periodic/entities/periodic.entity';
import { Periodic } from '@/lib/ormClient/client';

export class PeriodicMapper {
  static toDomain(entity: Periodic): PeriodicEntity {
    return PeriodicEntity.create({
      id: entity.id,
      transactionId: entity.transactionId,
      cycle: entity.cycle,
      duration: entity.duration,
      nextOcurrence: entity.nextOcurrence,
      createdAt: entity.createdAt,
      updatedAt: entity.updateAt,
    });
  }

  static toDomainList(entities: Periodic[]): PeriodicEntity[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  static toProps(entity: PeriodicEntity): Omit<Periodic, never> {
    return {
      id: entity.id,
      transactionId: entity.transactionId,
      cycle: entity.cycle,
      duration: entity.duration,
      nextOcurrence: entity.nextOcurrence,
      createdAt: entity.createdAt,
      updateAt: entity.updatedAt,
    } as Omit<Periodic, never>;
  }
}
