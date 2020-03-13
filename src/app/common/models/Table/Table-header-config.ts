import { FormControl } from '@angular/forms';

import { TNullable } from '../TNullable';

interface ITableHeaderConfig {
  value: TNullable<string>;
  sort: boolean;
  sticky: boolean;
  datePicker: boolean;
  inputControl: TNullable<FormControl | null>;
  min: TNullable<Date | null>;
  max: TNullable<Date | null>;
}

export class TableHeaderConfig implements ITableHeaderConfig {
  public value: TNullable<string>;
  public sort: boolean;
  public sticky: boolean;
  public datePicker: boolean;
  public inputControl: TNullable<FormControl>;
  public min: TNullable<Date>;
  public max: TNullable<Date>;

  constructor({
    value,
    sort = false,
    sticky = false,
    datePicker = false,
    inputControl = null,
    min = null,
    max = null,
  }: Partial<ITableHeaderConfig> = {}) {
    this.value = value;
    this.sort = sort;
    this.sticky = sticky;
    this.datePicker = datePicker;
    this.inputControl = inputControl;
    this.min = null;
    this.max = null;
  }
}
