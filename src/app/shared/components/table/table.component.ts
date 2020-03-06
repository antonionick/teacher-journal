import { Component, OnInit, OnChanges, Input, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { ITableHeaderConfig } from '../../../common/models/Table/Table-header-config';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit, OnChanges {
  @Input()
  public data: Array<T>;
  @Input('columnHeaders')
  public displayedColumns: Array<ITableHeaderConfig>;
  @ViewChild(MatSort, { static: true })
  public sort: MatSort;

  public dataSource: MatTableDataSource<T>;
  public headers: Array<string>;

  public ngOnChanges(change: SimpleChanges): void {
    const {
      data: { currentValue },
    } = change;
    this.dataSource = new MatTableDataSource(currentValue);
    this.dataSource.sort = this.sort;
  }

  public ngOnInit(): void {
    this.headers = this.displayedColumns.map((item) => item.value);
  }
}
