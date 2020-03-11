import {
  Component,
  ViewChild,
  SimpleChanges,
  Input,
  OnChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { ITableConfig, TableHeaderConfig } from '../../../common/models/Table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnChanges {
  @ViewChild(MatSort, { static: true })
  private sort: MatSort;

  @Input()
  public config: ITableConfig<T>;
  public columnHeaders: Array<string>;
  public dataSource: MatTableDataSource<T>;

  public ngOnChanges(change: SimpleChanges): void {
    const {
      config: { currentValue },
    } = change;

    this.columnHeaders = currentValue.headers
      .map((item: TableHeaderConfig) => item.value);
    this.dataSource = new MatTableDataSource(currentValue.body);
    this.dataSource.sort = this.sort;
  }
}
