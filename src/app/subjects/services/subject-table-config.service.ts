import { Injectable } from '@angular/core';

import {
  TableHeaderConfig,
  ITableConfig,
  IChangeField,
  TableBodyConfig,
} from '../../common/models/table';
import { Mark, EditMark, IMarksByDate } from '../../common/models/mark';
import { Student } from '../../common/models/student';
import { SubjectTableHeaderService } from './subject-table-header.service';
import { SubjectTableBodyService } from './subject-table-body.service';
import { TableConfigHistoryService } from './table-config-history.service';
import { IDataChanges } from '../../common/models/utils';
import { DateChanges } from 'src/app/common/models/utils/date-changes';

const headerConfig: Array<TableHeaderConfig> = [
  new TableHeaderConfig({
    value: 'name',
  }),
  new TableHeaderConfig({
    value: 'lastName',
    sticky: true,
  }),
  new TableHeaderConfig({
    value: 'average mark',
    sort: true,
    isAscSortStart: false,
  }),
];

@Injectable()
export class SubjectTableConfigService {
  private readonly editConfig: EditMark;
  private headerConfig: Array<TableHeaderConfig>;
  private dateChanges: DateChanges;

  public config: ITableConfig;

  constructor(
    private headerService: SubjectTableHeaderService,
    private bodyService: SubjectTableBodyService,
    private configHistory: TableConfigHistoryService,
  ) {
    this.editConfig = new EditMark();

    this.config = {
      headers: [],
      body: [],
    };
  }

  private resetRefConfig(): ITableConfig {
    return {
      headers: [...this.config.headers],
      body: [...this.config.body],
    };
  }

  private createHeaders(marks: IMarksByDate): Array<TableHeaderConfig> {
    let dateHeaders: Array<TableHeaderConfig> = this.headerService.createDateHeaders(marks);
    dateHeaders = this.headerService.sortDateHeaders(dateHeaders);
    dateHeaders = this.headerService.setRangeDateHeaders(dateHeaders);
    return [...this.headerConfig, ...dateHeaders];
  }

  private updateHeaders(): Array<TableHeaderConfig> {
    let dateHeaders: Array<TableHeaderConfig> = this.config.headers.slice(this.headerConfig.length);
    this.dateChanges = this.headerService.updateDateByChanges(dateHeaders);
    dateHeaders = this.headerService.setRangeDateHeaders(dateHeaders);
    return [...this.headerConfig, ...dateHeaders];
  }

  private createBody(
    marks: IMarksByDate,
    students: Array<Student>,
  ): Array<TableBodyConfig> {
    let body: Array<TableBodyConfig> = this.bodyService.createBody(marks, students);
    body = this.bodyService.sortBody(body);
    return body;
  }

  public createConfig(
    students: Array<Student>,
    marks: IMarksByDate,
  ): ITableConfig {
    this.headerConfig = headerConfig;
    this.config.headers = this.createHeaders(marks);
    this.config.body = this.createBody(marks, students);
    return this.config;
  }

  public updateConfigByDateChange(): ITableConfig {
    this.config.headers = this.updateHeaders();
    this.config.body = this.bodyService.updateBodyByDateChanges(
      this.config.body,
      this.dateChanges,
    );
    this.configHistory.updateDate(this.dateChanges);
    return this.resetRefConfig();
  }

  public addHeader(): ITableConfig {
    let dateHeaders: Array<TableHeaderConfig> = this.config.headers.slice(this.headerConfig.length);
    const newDateHeader: TableHeaderConfig = this.headerService.addDateHeader(dateHeaders);
    dateHeaders.push(newDateHeader);
    dateHeaders = this.headerService.sortDateHeaders(dateHeaders);
    dateHeaders = this.headerService.setRangeDateHeaders(dateHeaders);
    this.config.headers = [...this.headerConfig, ...dateHeaders];
    this.config.body = this.bodyService.updateBodyByAddDates(this.config.body, newDateHeader);
    return this.resetRefConfig();
  }

  public deleteHeader(input: HTMLInputElement): ITableConfig {
    const milliseconds: number = (
      new Date(input.value)
    ).getTime();
    this.config.headers = this.headerService.deleteDateHeader(milliseconds, this.config.headers);
    this.config.body = this.bodyService.deleteMarkByDate(milliseconds, this.config.body);
    this.configHistory.deleteDate(milliseconds);
    return this.resetRefConfig();
  }

  public updateMark(change: IChangeField<number>): ITableConfig {
    this.config.body = this.bodyService.updateMark(this.config.body, change);
    this.configHistory.updateMark(change);
    return this.resetRefConfig();
  }

  public getChanges(marks: IMarksByDate, subjectId: number): IDataChanges<Mark> {
    const changes: IDataChanges<Mark> = this.configHistory.getChanges(marks, subjectId);
    this.configHistory.resetHistoryChanges();
    return changes;
  }
}
