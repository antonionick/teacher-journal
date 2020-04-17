import { PipeTransform } from '@angular/core';

import { TNullable } from '../utils';
import { EditMark } from '../mark';

interface ITableCellConfig {
  value: string;
  editCell: TNullable<EditMark>;
  pipe: TNullable<PipeTransform>;
  pipeArgs: string;
  isExternal: boolean;
}

export class TableCellConfig implements ITableCellConfig {
  public value: string;
  public editCell: TNullable<EditMark>;
  public pipe: TNullable<PipeTransform>;
  public pipeArgs: string;
  public isExternal: boolean;

  constructor({
    value = '',
    editCell = null,
    pipe = null,
    pipeArgs = '',
    isExternal= false,
  }: Partial<ITableCellConfig> = {}) {
    this.value = value;
    this.editCell = editCell;
    this.pipe = pipe;
    this.pipeArgs = pipeArgs;
    this.isExternal = isExternal;
  }
}
