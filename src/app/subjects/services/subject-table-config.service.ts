import { Injectable } from '@angular/core';

import { ICell, TableHeaderConfig, ITableConfig } from '../../common/models/Table';
import { Mark } from '../../common/models/Mark';
import { Student } from '../../common/models/Student';
import { SubjectTableHeaderService } from './subject-table-header.service';
import { SubjectTableBodyService } from './subject-table-body.service';

@Injectable()
export class SubjectTableConfigService {
  private headerConfig: Array<TableHeaderConfig>;
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
    const dateHeaders: Array<TableHeaderConfig> = this.headerService.createDateHeaders(marks);
    this.headerService.sortDateHeaders(dateHeaders);
    this.headerService.setMinMaxDateHeaders(dateHeaders);
    return [...this.headerConfig, ...dateHeaders];
  }

  private updateHeaders(): Array<TableHeaderConfig> {
    const dateHeaders: Array<TableHeaderConfig> = this.config.headers.slice(3);
    this.headerService.updateDateHeaders(dateHeaders);
    this.headerService.setMinMaxDateHeaders(dateHeaders);
    return [...this.headerConfig, ...dateHeaders];
  }

  public createConfig(
    headerConfig: Array<TableHeaderConfig>,
    students: Array<Student>,
    marks: Array<Mark>,
  ): ITableConfig<ICell<string>> {
    this.headerConfig = headerConfig;

    const uniqueDates: Array<Mark> = this.getUniqueDates(marks);
    const headers: Array<TableHeaderConfig> = this.createHeaders(uniqueDates);
    this.config.headers = headers;

    const body: Array<ICell<string>> = this.bodyService.createBody(uniqueDates, students);
    this.bodyService.computeAverageMarkByBody(body);
    this.bodyService.sortBody(body);
    this.config.body = body;

    return this.config;
  }

  public updateConfig(): ITableConfig<ICell<string>> {
    const headers: Array<TableHeaderConfig> = this.updateHeaders();
    this.config.headers = headers;
    return this.config;
  }
}
