import { TableHeaderConfig, Paginator, TableBodyConfig } from './index';
import { TNullable } from '../utils';

export interface ITableConfig {
  headers: Array<TableHeaderConfig>;
  body: Array<TableBodyConfig>;
  paginator?: TNullable<Paginator>;
}
