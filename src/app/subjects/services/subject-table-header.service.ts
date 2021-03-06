import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

import {
  startOfDay,
  getClosestEmptyDate,
  getPrevDay,
  getNextDay,
} from 'src/app/common/utils/date';
import { TableHeaderConfig } from 'src/app/common/models/table';
import { TNullable, DateChanges } from 'src/app/common/models/utils';
import { IMarksByDate } from 'src/app/common/models/mark';

@Injectable()
export class SubjectTableHeaderService {
  private createDateHeader({ date }: { date: Date }): TableHeaderConfig {
    const milliseconds: number = date.getTime();
    return new TableHeaderConfig({
      title: `${ milliseconds }`,
      content: `${ milliseconds }`,
      datePicker: true,
      inputControl: new FormControl({ value: date, disabled: true }),
      sort: true,
      isAscSortStart: false,
      hoverContent: true,
    });
  }

  private checkDateOnUnique(date: Date, headers: Array<TableHeaderConfig>): boolean {
    return headers.every((header) => +header.title !== date.getTime());
  }

  private sortDateHeadersFunc(a: TableHeaderConfig, b: TableHeaderConfig): number {
    return +a.title - +b.title;
  }

  public createDateHeaders(marks: IMarksByDate): Array<TableHeaderConfig> {
    return Object.keys(marks)
      .map((milliseconds) => this.createDateHeader({ date: new Date(+milliseconds) }));
  }

  public addDateHeader(headers: Array<TableHeaderConfig>): TableHeaderConfig {
    let date: Date = new Date();
    startOfDay(date);

    const unique: boolean = this.checkDateOnUnique(date, headers);
    if (!unique) {
      date = getClosestEmptyDate(date, headers);
    }

    return this.createDateHeader({ date });
  }

  public deleteDateHeader(
    milliseconds: number,
    headers: Array<TableHeaderConfig>,
  ): Array<TableHeaderConfig> {
    return headers.filter((item) => {
      if (Number.isNaN(+item.title)) {
        return true;
      }

      return +item.title !== milliseconds;
    });
  }

  public updateDateByChanges(headers: Array<TableHeaderConfig>): TNullable<DateChanges> {
    const changeDates: DateChanges = new DateChanges();
    let milliseconds: number;

    const updatedHeader: TableHeaderConfig =
      headers.find((header) => {
        const date: Date = new Date(header.inputControl.value);
        milliseconds = date.getTime();

        return +header.title !== milliseconds;
      }) || null;

    if (updatedHeader === null) {
      return null;
    }

    changeDates.current = milliseconds;
    changeDates.previously = +updatedHeader.title;
    updatedHeader.title = `${ milliseconds }`;

    return changeDates;
  }

  public setRangeDateHeaders(headers: Array<TableHeaderConfig>): Array<TableHeaderConfig> {
    let minDate: TNullable<Date> = null;
    let maxDate: TNullable<Date> = null;

    return headers.map((item, i) => {
      if (i + 1 !== headers.length) {
        maxDate = getPrevDay(+headers[i + 1].title);
      } else {
        maxDate = null;
      }

      const header: TableHeaderConfig = Object.assign({}, item);
      header.min = minDate;
      header.max = maxDate;
      minDate = getNextDay(+header.title);
      return header;
    });
  }

  public sortDateHeaders(
    headers: Array<TableHeaderConfig>,
    sort?: (a: TableHeaderConfig, b: TableHeaderConfig) => number,
  ): Array<TableHeaderConfig> {
    const sortHeaders: Array<TableHeaderConfig> = [...headers];
    if (sortHeaders.length < 2) {
      return sortHeaders;
    }

    if (sort === undefined) {
      sort = this.sortDateHeadersFunc;
    }

    return sortHeaders.sort(sort);
  }
}
