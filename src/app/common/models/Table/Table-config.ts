import { TableHeaderConfig, Paginator } from './index';
import { EditMark } from '../mark/edit-mark';
import { TNullable } from '../useful/tnullable';

export interface ITableConfig<T> {
  headers: Array<TableHeaderConfig>;
  body: Array<T>;
  paginator?: TNullable<Paginator>;
  editCell?: TNullable<EditMark>;
}
