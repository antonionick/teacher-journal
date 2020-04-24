import { TableCellConfig } from './table-cell-config';

export interface TableBodyConfig {
  [tableHeader: string]: TableCellConfig;
}
