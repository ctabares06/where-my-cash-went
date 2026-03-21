/**
 * Base Value Object class
 * Value objects are immutable and compared by their properties
 */
export abstract class ValueObject<Props> {
  constructor(protected readonly props: Props) {}

  equals(vo: ValueObject<Props>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
