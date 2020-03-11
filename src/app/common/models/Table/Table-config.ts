import { TableHeaderConfig, Paginator } from './index';

export interface ITableConfig<T> {
  headers: Array<TableHeaderConfig>;
  body: Array<T>;
  paginator?: Paginator;
}
