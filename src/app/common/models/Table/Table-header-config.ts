import { TNullable } from '../TNullable';

interface ITableHeaderConfig {
  value: TNullable<string>;
  sort: boolean;
  sticky: boolean;
  datePicker: boolean;
}

export class TableHeaderConfig implements ITableHeaderConfig {
  public value: TNullable<string>;
  public sort: boolean;
  public sticky: boolean;
  public datePicker: boolean;

  constructor({
    value,
    sort = false,
    sticky = false,
    datePicker = false,
  }: Partial<ITableHeaderConfig> = {}) {
    this.value = value;
    this.sort = sort;
    this.sticky = sticky;
    this.datePicker = datePicker;
  }
}
