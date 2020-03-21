import { FormControl } from '@angular/forms';

import { TNullable } from '../tnullable';

interface ITableHeaderConfig {
  value: TNullable<string>;
  sort: boolean;
  isAscSortStart: boolean;
  sticky: boolean;
  datePicker: boolean;
  inputControl: TNullable<FormControl | null>;
  min: TNullable<Date | null>;
  max: TNullable<Date | null>;
  isDelete: boolean;
}

export class TableHeaderConfig implements ITableHeaderConfig {
  public value: TNullable<string>;
  public sort: boolean;
  public isAscSortStart: boolean;
  public sticky: boolean;
  public datePicker: boolean;
  public inputControl: TNullable<FormControl>;
  public min: TNullable<Date>;
  public max: TNullable<Date>;
  public isDelete: boolean;

  constructor({
    value,
    sort = false,
    isAscSortStart = true,
    sticky = false,
    datePicker = false,
    inputControl = null,
    min = null,
    max = null,
    isDelete = false,
  }: Partial<ITableHeaderConfig> = {}) {
    this.value = value;
    this.sort = sort;
    this.isAscSortStart = isAscSortStart;
    this.sticky = sticky;
    this.datePicker = datePicker;
    this.inputControl = inputControl;
    this.min = min;
    this.max = max;
    this.isDelete = isDelete;
  }
}
