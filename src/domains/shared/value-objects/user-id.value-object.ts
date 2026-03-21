/**
 * UserId Value Object - Wraps user ID string for type safety
 */
export class UserId {
  private constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('UserId cannot be empty');
    }
  }

  static create(value: string): UserId {
    return new UserId(value);
  }

  get valueOf(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
