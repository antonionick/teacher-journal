import { TNullable } from './TNullable';

interface IDateChanges {
  current: TNullable<number>;
  previously: TNullable<number>;
}

export class DateChanges implements IDateChanges {
  public current: TNullable<number>;
  public previously: TNullable<number>;

  constructor({
    current = null,
    previously = null,
  }: Partial<IDateChanges> = {}) {
    this.current = current;
    this.previously = previously;
  }
}
