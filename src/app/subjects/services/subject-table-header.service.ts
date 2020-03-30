import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

import {
  startOfDay,
  getClosestEmptyDate,
  getPrevDay,
  getNextDay,
} from 'src/app/common/helpers/date';
import { TableHeaderConfig } from 'src/app/common/models/table';
import { TNullable } from 'src/app/common/models/utils/tnullable';
import { IMarksByDate } from 'src/app/common/models/mark';
import { DateChanges } from 'src/app/common/models/utils/date-changes';

@Injectable()
export class SubjectTableHeaderService {
  private createDateHeader({ date }: { date: Date }): TableHeaderConfig {
    return new TableHeaderConfig({
      value: `${date.getTime()}`,
      datePicker: true,
      inputControl: new FormControl({ value: date, disabled: true }),
      sort: true,
      isAscSortStart: false,
    });
  }

  private checkDateOnUnique(date: Date, headers: Array<TableHeaderConfig>): boolean {
    return headers.every((header) => +header.value !== date.getTime());
  }

  private sortDateHeadersFunc(a: TableHeaderConfig, b: TableHeaderConfig): number {
    return +a.value - +b.value;
  }

  public createDateHeaders(marks: IMarksByDate): Array<TableHeaderConfig> {
    return Object.keys(marks).map((milliseconds) =>
      this.createDateHeader({ date: new Date(+milliseconds) }),
    );
  }

  public addDateHeader(headers: Array<TableHeaderConfig>): Array<TableHeaderConfig> {
    let date: Date = new Date();
    startOfDay(date);

    const unique: boolean = this.checkDateOnUnique(date, headers);
    if (!unique) {
      date = getClosestEmptyDate(date, headers);
    }

    const header: TableHeaderConfig = this.createDateHeader({ date });
    return [...headers, header];
  }

  public deleteDateHeader(
    milliseconds: number,
    headers: Array<TableHeaderConfig>,
  ): Array<TableHeaderConfig> {
    return headers.filter((item) => {
      if (Number.isNaN(+item.value)) {
        return true;
      }

      return +item.value !== milliseconds;
    });
  }

  public updateDateByChanges(headers: Array<TableHeaderConfig>): TNullable<DateChanges> {
    const changeDates: DateChanges = new DateChanges();
    let milliseconds: number;

    const updatedHeader: TableHeaderConfig =
      headers.find((header) => {
        const date: Date = new Date(header.inputControl.value);
        milliseconds = date.getTime();

        return +header.value !== milliseconds;
      }) || null;

    if (updatedHeader === null) {
      return null;
    }

    changeDates.current = milliseconds;
    changeDates.previously = +updatedHeader.value;
    updatedHeader.value = `${milliseconds}`;

    return changeDates;
  }

  public setRangeDateHeaders(headers: Array<TableHeaderConfig>): Array<TableHeaderConfig> {
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
