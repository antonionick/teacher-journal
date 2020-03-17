import { Injectable } from '@angular/core';

import { ICell, TableHeaderConfig, ITableConfig } from '../../common/models/Table';
import { Mark } from '../../common/models/Mark';
import { Student } from '../../common/models/Student';
import { SubjectTableHeaderService } from './subject-table-header.service';
import { SubjectTableBodyService } from './subject-table-body.service';
import { DateChanges } from 'src/app/common/models/Date-changes';

@Injectable()
export class SubjectTableConfigService {
  private headerConfig: Array<TableHeaderConfig>;
  private dateChanges: DateChanges;

  public config: ITableConfig<ICell<string>>;

  constructor(
    private headerService: SubjectTableHeaderService,
    private bodyService: SubjectTableBodyService,
  ) {
    this.config = {
      headers: [],
      body: [],
    };
  }

  private resetRefConfig(): ITableConfig<ICell<string>> {
    return {
      headers: [...this.config.headers],
      body: [...this.config.body],
    };
  }

  private getUniqueDates(marks: Array<Mark>): Array<Mark> {
    const dates: { [key: string]: boolean } = {};

    return marks.filter((mark) => {
      if (dates[mark.date]) {
        return false;
      }

      return (dates[mark.date] = true);
    });
  }

  private createHeaders(marks: Array<Mark>): Array<TableHeaderConfig> {
    const uniqueDates: Array<Mark> = this.getUniqueDates(marks);
    let dateHeaders: Array<TableHeaderConfig> = this.headerService.createDateHeaders(uniqueDates);
    dateHeaders = this.headerService.sortDateHeaders(dateHeaders);
    dateHeaders = this.headerService.setMinMaxDateHeaders(dateHeaders);
    return [...this.headerConfig, ...dateHeaders];
  }

  private updateHeaders(): Array<TableHeaderConfig> {
    let dateHeaders: Array<TableHeaderConfig> = this.config.headers.slice(3);
    this.dateChanges = this.headerService.checkChangeHeader(dateHeaders);
    dateHeaders = this.headerService.setMinMaxDateHeaders(dateHeaders);
    return [...this.headerConfig, ...dateHeaders];
  }

  private createBody(marks: Array<Mark>, students: Array<Student>): Array<ICell<string>> {
    let body: Array<ICell<string>> = this.bodyService.createBody(marks, students);
    this.bodyService.computeAverageMarkByBody(body);
    body = this.bodyService.sortBody(body);
    return body;
  }

  public createConfig(
    headerConfig: Array<TableHeaderConfig>,
    students: Array<Student>,
    marks: Array<Mark>,
  ): ITableConfig<ICell<string>> {
    this.headerConfig = headerConfig;

    this.config.headers = this.createHeaders(marks);

    this.config.body = this.createBody(marks, students);

    return this.config;
  }

  public updateConfig(): ITableConfig<ICell<string>> {
    this.config.headers = this.updateHeaders();

    this.config.body = this.bodyService.updateMarksByDate(
      this.config.body,
      this.dateChanges,
    );

    return this.resetRefConfig();
  }

  public addHeader(): ITableConfig<ICell<string>> {
    let dateHeaders: Array<TableHeaderConfig> = this.config.headers.slice(3);
    dateHeaders = this.headerService.addDateHeader(dateHeaders);
    dateHeaders = this.headerService.sortDateHeaders(dateHeaders);
    dateHeaders = this.headerService.setMinMaxDateHeaders(dateHeaders);
    this.config.headers = [...this.headerConfig, ...dateHeaders];
    return this.resetRefConfig();
  }

  public deleteHeader(input: HTMLInputElement): ITableConfig<ICell<string>> {
    const milliseconds: number = new Date(input.value).getTime();
    this.config.headers = this.headerService.deleteDateHeader(milliseconds, this.config.headers);
    this.config.body = this.bodyService.deleteMark(milliseconds, this.config.body);
    return this.resetRefConfig();
  }
}
