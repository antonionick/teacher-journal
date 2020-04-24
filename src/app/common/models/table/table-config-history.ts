import { TNullable } from '../utils';
import { MarkHistory } from '../mark';

interface ITableConfigHistory {
  source: TNullable<number>;
  current: TNullable<number>;
  isDeleted: boolean;
  marks: Array<MarkHistory>;
}

export class TableConfigHistory implements ITableConfigHistory {
  public source: TNullable<number>;
  public current: TNullable<number>;
  public isDeleted: boolean;
  public marks: Array<MarkHistory>;

  constructor({
    source = null,
    current = null,
    isDeleted = false,
    marks = [],
  }: Partial<ITableConfigHistory> = {}) {
    this.source = source;
    this.current = current;
    this.isDeleted = isDeleted;
    this.marks = marks;
  }
}
