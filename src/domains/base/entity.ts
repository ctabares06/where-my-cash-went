/**
 * Base Entity class - Framework agnostic
 * All domain entities should extend this
 */
export abstract class Entity<T> {
  constructor(public readonly id: T) {}

  equals(entity: Entity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    return this.id === entity.id;
  }
}
