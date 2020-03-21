import {
  Component,
  ViewChild,
  SimpleChanges,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { ITableConfig, TableHeaderConfig, IChangeField } from '../../../common/models/table';

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

  @Output('headerChange')
  public dateChange: EventEmitter<MatDatepickerInputEvent<Date>> = new EventEmitter();
  @Output()
  public changeField: EventEmitter<IChangeField<number>> = new EventEmitter();

  public ngOnChanges(change: SimpleChanges): void {
    const {
      config: { currentValue },
    } = change;

    this.columnHeaders = currentValue.headers.map((item: TableHeaderConfig) => item.value);
    this.dataSource = new MatTableDataSource(currentValue.body);
    this.dataSource.sort = this.sort;
  }

  public onDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.dateChange.emit(event);
  }

  public onChangeMark(change: IChangeField<number>): void {
    this.changeField.emit(change);
  }
}
