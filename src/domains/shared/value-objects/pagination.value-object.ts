/**
 * Pagination Value Object
 */
export class PaginationVO {
  constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {
    if (page < 0) throw new Error('Page must be non-negative');
    if (limit < 1) throw new Error('Limit must be positive');
  }

  get skip(): number {
    return this.page * this.limit;
  }

  static create(page: number = 0, limit: number = 10): PaginationVO {
    return new PaginationVO(page, limit);
  }
}
