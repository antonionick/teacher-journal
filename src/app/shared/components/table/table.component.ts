import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import {
  IChangeField,
  ITableConfig,
  TableBodyConfig,
  TableHeaderConfig,
} from '../../../common/models/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnChanges {
  @Input()
  public config: ITableConfig;
  public columnHeaders: Array<string>;
  public dataSource: MatTableDataSource<TableBodyConfig>;

  @Output()
  public changeField: EventEmitter<IChangeField<number>> = new EventEmitter();
  @Output()
  public headerHoverContentClick: EventEmitter<TableHeaderConfig> = new EventEmitter();
  @Output('headerChange')
  public dateChange: EventEmitter<MatDatepickerInputEvent<Date>> = new EventEmitter();

  @ContentChild('external')
  public external: TemplateRef<HTMLElement>;
  @ContentChild('headerHoverContent')
  public headerHoverContent: TemplateRef<HTMLElement>;

  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private sort({ active, direction }: Sort):
    (a: TableBodyConfig, b: TableBodyConfig) => number {
    return (a, b) => {
      const isAsc: boolean = direction === 'asc';

      return this.compare(a[active].value, b[active].value, isAsc);
    };
  }

  public ngOnChanges(change: SimpleChanges): void {
    let {
      config: { currentValue },
    } = change;
    if (currentValue === null) {
      this.config = currentValue = {
        headers: [],
        body: [],
      };
    }

    this.columnHeaders = currentValue.headers.map((item: TableHeaderConfig) => item.value);
    this.dataSource = new MatTableDataSource(currentValue.body);
  }

  public onDateChange(event: MatDatepickerInputEvent<Date>): void {
    this.dateChange.emit(event);
  }

  public onChangeMark(change: IChangeField<number>): void {
    this.changeField.emit(change);
  }

  public sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.dataSource = new MatTableDataSource(this.config.body);
      return;
    }

    const data: Array<TableBodyConfig> = this.config.body.slice();
    const sortedData: Array<TableBodyConfig> = data.sort(this.sort(sort));
    this.dataSource = new MatTableDataSource(sortedData);
  }

  public onHeaderContentClick(event: MouseEvent, header: TableHeaderConfig): void {
    event.stopPropagation();
    this.headerHoverContentClick.emit(header);
  }
}
