import { FormControl } from '@angular/forms';

import { TNullable } from '../utils';

interface ITableHeaderConfig {
  title: TNullable<string>;
  content: TNullable<string>;
  sort: boolean;
  isAscSortStart: boolean;
  sticky: boolean;
  datePicker: boolean;
  inputControl: TNullable<FormControl>;
  min: TNullable<Date>;
  max: TNullable<Date>;
  isVisible: boolean;
  hoverContent: boolean;
}

export class TableHeaderConfig implements ITableHeaderConfig {
  public title: TNullable<string>;
  public content: TNullable<string>;
  public sort: boolean;
  public isAscSortStart: boolean;
  public sticky: boolean;
  public datePicker: boolean;
  public inputControl: TNullable<FormControl>;
  public min: TNullable<Date>;
  public max: TNullable<Date>;
  public isVisible: boolean;
  public hoverContent: boolean;

  constructor({
    title = null,
    content = null,
    sort = false,
    isAscSortStart = true,
    sticky = false,
    datePicker = false,
    inputControl = null,
    min = null,
    max = null,
    isVisible = true,
    hoverContent = false,
  }: Partial<ITableHeaderConfig> = {}) {
    this.title = title;
    this.content = content;
    this.sort = sort;
    this.isAscSortStart = isAscSortStart;
    this.sticky = sticky;
    this.datePicker = datePicker;
    this.inputControl = inputControl;
    this.min = min;
    this.max = max;
    this.isVisible = isVisible;
    this.hoverContent = hoverContent;
  }
}
