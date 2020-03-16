import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

import { TableHeaderConfig } from 'src/app/common/models/Table';
import { TNullable } from 'src/app/common/models/TNullable';
import { Mark } from 'src/app/common/models/Mark';
import { DateService } from 'src/app/common/services/date.service';

@Injectable()
export class SubjectTableHeaderService {
  constructor(
    private dateService: DateService,
  ) { }

  private sortDateHeadersFunc(a: TableHeaderConfig, b: TableHeaderConfig): number {
    return +a.value - +b.value;
  }

  public createDateHeaders(marks: Array<Mark>): Array<TableHeaderConfig> {
    return marks.map((mark) => {
      const markDate: Date = new Date(mark.date);
      return new TableHeaderConfig({
        value: mark.date.toString(),
        datePicker: true,
        inputControl: new FormControl({ value: markDate, disabled: true }),
        sort: true,
        isAscSortStart: false,
      });
    });
  }

  public updateDateHeaders(headers: Array<TableHeaderConfig>): void {
    headers.forEach((header) => {
      const date: Date = new Date(header.inputControl.value);
      header.value = date.getTime().toString();
    });
  }

  public setMinMaxDateHeaders(headers: Array<TableHeaderConfig>): void {
    let minDate: TNullable<Date> = null;
    let maxDate: TNullable<Date> = null;

    headers.forEach((header, i) => {
      if (i + 1 !== headers.length) {
        maxDate = this.dateService.getPrevDay(+headers[i + 1].value);
      } else {
        maxDate = null;
      }

      header.min = minDate;
      header.max = maxDate;
      minDate = this.dateService.getNextDay(+header.value);
    });
  }

  public sortDateHeaders(
    headers: Array<TableHeaderConfig>,
    sort?: (a: TableHeaderConfig, b: TableHeaderConfig) => number,
  ): void {
    if (headers.length < 2) {
      return;
    }
    if (!sort) {
      sort = this.sortDateHeadersFunc;
    }

    headers.sort(sort);
  }
}
