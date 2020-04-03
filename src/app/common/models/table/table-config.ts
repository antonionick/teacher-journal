import { TableHeaderConfig, Paginator } from './index';
import { EditMark } from '../mark';
import { TNullable } from '../utils/tnullable';

export interface ITableConfig<T> {
  headers: Array<TableHeaderConfig>;
  body: Array<T>;
  paginator?: TNullable<Paginator>;
  editCell?: TNullable<EditMark | undefined>;
}