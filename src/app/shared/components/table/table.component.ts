import { Component, OnInit, OnChanges, Input, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { TableHeaderConfig } from '../../../common/entities/Table/TableHeaderConfig';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit, OnChanges {
  @Input()
  public data: Array<T>;
  @Input('columnHeaders')
  public displayedColumns: Array<TableHeaderConfig>;
  @ViewChild(MatSort, {static: true})
  public sort: MatSort;

  public dataSource: MatTableDataSource<T>;
  public headers: Array<string>;

  constructor() {}

  public ngOnChanges(change: SimpleChanges): void {
    const { data: { currentValue } } = change;
    this.dataSource = new MatTableDataSource(currentValue);
    this.dataSource.sort = this.sort;
  }

  public ngOnInit(): void {
    this.headers = this.displayedColumns.map((item) => item.value);
  }
}
