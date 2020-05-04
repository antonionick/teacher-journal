import { TableCellConfig } from './table-cell-config';

export interface ITableBodyConfig {
  [tableHeader: string]: TableCellConfig;
}
