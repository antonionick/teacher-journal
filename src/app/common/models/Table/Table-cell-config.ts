import { TNullable } from '../TNullable';

interface ICellConfig {
  value: TNullable<string>;
}

export class CellConfig implements ICellConfig {
  public value: TNullable<string>;

  constructor(value: TNullable<string>) {
    this.value = value;
  }
}
