import { TableHeaderConfig, Paginator } from './index';
import { EditMark } from '../Edit-mark';

export interface ITableConfig<T> {
  headers: Array<TableHeaderConfig>;
  body: Array<T>;
  paginator?: Paginator;
  editCell?: EditMark;
}
