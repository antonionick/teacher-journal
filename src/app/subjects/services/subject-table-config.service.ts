import { Injectable } from '@angular/core';

import { ICell, TableHeaderConfig, ITableConfig, IChangeField } from '../../common/models/table';
import { Mark } from '../../common/models/mark';
import { Student } from '../../common/models/student';
import { SubjectTableHeaderService } from './subject-table-header.service';
import { SubjectTableBodyService } from './subject-table-body.service';
import { DateChanges } from 'src/app/common/models/date-changes';
import { EditMark } from 'src/app/common/models/edit-mark';

@Injectable()
export class SubjectTableConfigService {
  private readonly editConfig: EditMark;
  private headerConfig: Array<TableHeaderConfig>;
  private dateChanges: DateChanges;

  public config: ITableConfig<ICell<string>>;

  constructor(
    private headerService: SubjectTableHeaderService,
    private bodyService: SubjectTableBodyService,
  ) {
    this.editConfig = new EditMark();

    this.config = {
      headers: [],
      body: [],
      editCell: this.editConfig,
    };
  }

  private resetRefConfig(): ITableConfig<ICell<string>> {
    return {
      headers: [...this.config.headers],
      body: [...this.config.body],
      editCell: this.editConfig,
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
    dateHeaders = this.headerService.setRangeDateHeaders(dateHeaders);
    return [...this.headerConfig, ...dateHeaders];
  }

  private updateHeaders(): Array<TableHeaderConfig> {
    let dateHeaders: Array<TableHeaderConfig> = this.config.headers.slice(this.headerConfig.length);
    this.dateChanges = this.headerService.updateDateByChanges(dateHeaders);
    dateHeaders = this.headerService.setRangeDateHeaders(dateHeaders);
    return [...this.headerConfig, ...dateHeaders];
  }

  private createBody(marks: Array<Mark>, students: Array<Student>): Array<ICell<string>> {
    let body: Array<ICell<string>> = this.bodyService.createBody(marks, students);
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

  public updateConfigByDateChange(): ITableConfig<ICell<string>> {
    this.config.headers = this.updateHeaders();
    this.config.body = this.bodyService.updateBodyByDateChanges(
      this.config.body,
      this.dateChanges,
    );
    return this.resetRefConfig();
  }

  public addHeader(): ITableConfig<ICell<string>> {
    let dateHeaders: Array<TableHeaderConfig> = this.config.headers.slice(this.headerConfig.length);
    dateHeaders = this.headerService.addDateHeader(dateHeaders);
    dateHeaders = this.headerService.sortDateHeaders(dateHeaders);
    dateHeaders = this.headerService.setRangeDateHeaders(dateHeaders);
    this.config.headers = [...this.headerConfig, ...dateHeaders];
    return this.resetRefConfig();
  }

  public deleteHeader(input: HTMLInputElement): ITableConfig<ICell<string>> {
    const milliseconds: number = new Date(input.value).getTime();
    this.config.headers = this.headerService.deleteDateHeader(milliseconds, this.config.headers);
    this.config.body = this.bodyService.deleteMarkByDate(milliseconds, this.config.body);
    return this.resetRefConfig();
  }

  public updateMark(change: IChangeField<number>): ITableConfig<ICell<string>> {
    this.config.body = this.bodyService.updateMark(this.config.body, change);
    return this.resetRefConfig();
  }
}
