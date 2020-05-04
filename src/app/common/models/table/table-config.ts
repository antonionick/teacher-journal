import { TableHeaderConfig, Paginator, ITableBodyConfig } from './index';
import { TNullable } from '../utils';

export interface ITableConfig {
  headers: Array<TableHeaderConfig>;
  body: Array<ITableBodyConfig>;
  paginator?: TNullable<Paginator>;
}
