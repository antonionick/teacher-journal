import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

import {
  resetDate,
  getClosestEmptyDate,
  getPrevDay,
  getNextDay,
} from 'src/app/common/helpers/date';
import { TableHeaderConfig } from 'src/app/common/models/table';
import { TNullable } from 'src/app/common/models/tnullable';
import { Mark } from 'src/app/common/models/mark';
import { DateChanges } from 'src/app/common/models/date-changes';

@Injectable()
export class SubjectTableHeaderService {
  private createDateHeaderByMark(mark: Mark): TableHeaderConfig {
    const markDate: Date = new Date(mark.date);

    return new TableHeaderConfig({
      value: mark.date.toString(),
      datePicker: true,
      inputControl: new FormControl({ value: markDate, disabled: true }),
      sort: true,
      isAscSortStart: false,
    });
  }

  private createDateHeaderByDate(date: Date): TableHeaderConfig {
    return new TableHeaderConfig({
      value: date.getTime().toString(),
      datePicker: true,
      inputControl: new FormControl({ value: date, disabled: true }),
      sort: true,
      isAscSortStart: false,
      isDelete: true,
    });
  }

  private checkDateOnUnique(date: Date, headers: Array<TableHeaderConfig>): boolean {
    return headers.every((header) => +header.value !== date.getTime());
  }

  private sortDateHeadersFunc(a: TableHeaderConfig, b: TableHeaderConfig): number {
    return +a.value - +b.value;
  }

  public createDateHeaders(marks: Array<Mark>): Array<TableHeaderConfig> {
    return marks.map((mark) => {
      return this.createDateHeaderByMark(mark);
    });
  }

  public addDateHeader(headers: Array<TableHeaderConfig>): Array<TableHeaderConfig> {
    let date: Date = new Date();
    resetDate(date);

    const unique: boolean = this.checkDateOnUnique(date, headers);
    if (!unique) {
      date = getClosestEmptyDate(date, headers);
    }

    const header: TableHeaderConfig = this.createDateHeaderByDate(date);
    return [...headers, header];
  }

  public deleteDateHeader(
    milliseconds: number,
    headers: Array<TableHeaderConfig>,
  ): Array<TableHeaderConfig> {
    return headers.filter((item) => +item.value !== milliseconds);
  }

  public checkChangeHeader(headers: Array<TableHeaderConfig>): TNullable<DateChanges> {
    const changeDates: DateChanges = new DateChanges();

    headers.forEach((header) => {
      const date: Date = new Date(header.inputControl.value);
      if (header.value === date.getTime().toString()) {
        return;
      }

      changeDates.current = date.getTime();
      changeDates.previously = +header.value;
      header.value = date.getTime().toString();
    });

    return changeDates.current !== null ? changeDates : null;
  }

  public setMinMaxDateHeaders(headers: Array<TableHeaderConfig>): Array<TableHeaderConfig> {
    let minDate: TNullable<Date> = null;
    let maxDate: TNullable<Date> = null;

    return headers.map((item, i) => {
      if (i + 1 !== headers.length) {
        maxDate = getPrevDay(+headers[i + 1].value);
      } else {
        maxDate = null;
      }

      const header: TableHeaderConfig = Object.assign({}, item);
      header.min = minDate;
      header.max = maxDate;
      minDate = getNextDay(+header.value);
      return header;
    });
  }

  public sortDateHeaders(
    headers: Array<TableHeaderConfig>,
    sort?: (a: TableHeaderConfig, b: TableHeaderConfig) => number,
  ): Array<TableHeaderConfig> {
    if (headers.length < 2) {
      return headers;
    }

    const sortHeaders: Array<TableHeaderConfig> = headers.slice();
    if (!sort) {
      sort = this.sortDateHeadersFunc;
    }

    return sortHeaders.sort(sort);
  }
}
