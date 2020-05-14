import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ITableConfig, IChangeField, TableHeaderConfig } from '../../common/models/table';
import { Student } from 'src/app/common/models/student/student';
import { Mark, IMarksByDate } from 'src/app/common/models/mark';
import { SubjectTableConfigService } from './subject-table-config.service';
import { IDataChanges } from 'src/app/common/models/utils/data-changes';
import { MarkService } from '../../common/services';

@Injectable()
export class SubjectTableService {
  private students: Array<Student>;
  private marks: IMarksByDate;

  constructor(
    private configService: SubjectTableConfigService,
    private markService: MarkService,
  ) {
    this.students = [];
    this.marks = {};
  }

  public set subjectStudents(students: Array<Student>) {
    this.students = students;
  }

  public set subjectMarks(marks: Array<Mark>) {
    this.marks = this.markService.getMarksByDate(marks);
  }

  public getChanges(subjectId: number): IDataChanges<Mark> {
    return this.configService.getChanges(this.marks, subjectId);
  }

  public createConfig(): Observable<ITableConfig> {
    return this.configService.getConfig(this.students, this.marks);
  }

  public updateConfig(): void {
    this.configService.updateConfig(this.students, this.marks);
  }

  public updateConfigByDateChanges(): void {
    this.configService.updateConfigByDateChanges();
  }

  public addHeader(): void {
    this.configService.addHeader();
  }

  public deleteHeader(header: TableHeaderConfig): void {
    this.configService.deleteHeader(header);
  }

  public updateMark(change: IChangeField<number>): void {
    this.configService.updateMark(change);
  }
}
