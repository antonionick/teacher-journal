import { Injectable } from '@angular/core';

import { ICell, TableHeaderConfig, ITableConfig } from '../../common/models/Table';
import { Mark } from '../../common/models/Mark';
import { FormControl } from '@angular/forms';
import { TNullable } from 'src/app/common/models/TNullable';
import { DateService } from '../../common/services';

const headerConfig: Array<TableHeaderConfig> = [
  new TableHeaderConfig({
    value: 'name',
    sort: true,
  }),
  new TableHeaderConfig({
    value: 'lastName',
  }),
  new TableHeaderConfig({
    value: 'average mark',
  }),
];

const testMarks: Array<Mark> = [
  {
    id: 1,
    studentId: 1,
    subjectId: 1,
    date: 1026000000,
    value: 5,
  },
  {
    id: 2,
    studentId: 1,
    subjectId: 1,
    date: 5432400000,
    value: 6,
  },
  {
    id: 3,
    studentId: 2,
    subjectId: 1,
    date: 5778000000,
    value: 5,
  },
  {
    id: 4,
    studentId: 2,
    subjectId: 1,
    date: 1026000000,
    value: 7,
  },
];

@Injectable()
export class SubjectTableConfigService {
  public config: ITableConfig<ICell<string>>;

  constructor(
    private dateService: DateService,
  ) {
    this.config = {
      headers: [],
      body: [],
    };
  }

  private getUniqueDates(marks: Array<Mark>): Array<Mark> {
    const dates: { [key: string]: boolean } = {};

    return marks.filter((mark) => {
      if (dates[mark.date]) {
        return false;
      }

      return dates[mark.date] = true;
    });
  }

  private createDateHeaders(marks: Array<Mark>): Array<TableHeaderConfig> {
    const uniqueDates: Array<Mark> = this.getUniqueDates(marks);

    return uniqueDates.map((mark) => {
      const markDate: Date = new Date(mark.date);
      return new TableHeaderConfig({
        value: mark.date.toString(),
        datePicker: true,
        inputControl: new FormControl(markDate),
      });
    });
  }

  private updateDateHeaders(headers: Array<TableHeaderConfig>): void {
    headers.forEach((header) => {
      const date: Date = new Date(header.inputControl.value);
      header.value = date.getTime().toString();
    });
  }

  private sortDateHeaders(headers: Array<TableHeaderConfig>): void {
    if (headers.length < 2) {
      return;
    }

    function sort(a: TableHeaderConfig, b: TableHeaderConfig): number {
      return +a.value - +b.value;
    }

    headers.sort(sort);
  }

  private setMinMaxDateHeaders(headers: Array<TableHeaderConfig>): void {
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

  private createHeaders(marks: Array<Mark>): Array<TableHeaderConfig> {
    const dateHeaders: Array<TableHeaderConfig> = this.createDateHeaders(marks);
    this.sortDateHeaders(dateHeaders);
    this.setMinMaxDateHeaders(dateHeaders);
    return [...headerConfig, ...dateHeaders];
  }

  private updateHeaders(): Array<TableHeaderConfig> {
    const dateHeaders: Array<TableHeaderConfig> = this.config.headers.slice(3);
    this.updateDateHeaders(dateHeaders);
    this.setMinMaxDateHeaders(dateHeaders);
    return [...headerConfig, ...dateHeaders];
  }

  public createConfig(): ITableConfig<ICell<string>> {
    const headers: Array<TableHeaderConfig> = this.createHeaders(testMarks);
    this.config.headers = headers;
    return this.config;
  }

  public updateConfig(): ITableConfig<ICell<string>> {
    const headers: Array<TableHeaderConfig> = this.updateHeaders();
    this.config.headers = headers;
    return this.config;
  }
}
