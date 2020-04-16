import { Injectable } from '@angular/core';

import { ITableConfig, ICell, IChangeField } from '../../common/models/table';
import { Student } from 'src/app/common/models/student/student';
import { Mark, IMarksByDate } from 'src/app/common/models/mark';
import { SubjectTableConfigService } from './subject-table-config.service';
import { IDataChanges } from 'src/app/common/models/utils/data-changes';
import { getEmptyDate } from 'src/app/common/utils/date';

@Injectable()
export class SubjectTableService {
  private students: Array<Student>;
  private marks: IMarksByDate;

  constructor(
    private configService: SubjectTableConfigService,
  ) {
    this.students = [];
    this.marks = {};
  }

  private getMarksByDate(marks: Array<Mark>): IMarksByDate {
    const obj: IMarksByDate = {};

    marks.forEach((item) => {
      const milliseconds: number = getEmptyDate(item.date).getTime();

      if (!obj[milliseconds]) {
        obj[milliseconds] = {};
      }

      obj[milliseconds][item.studentId] = item;
    });

    return obj;
  }

  public set subjectStudents(students: Array<Student>) {
    this.students = students;
  }

  public set subjectMarks(marks: Array<Mark>) {
    this.marks = this.getMarksByDate(marks);
  }

  public getChanges(subjectId: number): IDataChanges<Mark> {
    return this.configService.getChanges(this.marks, subjectId);
  }

  public createConfig(): ITableConfig<ICell<string>> {
    return this.configService.createConfig(this.students, this.marks);
  }

  public updateConfig(): ITableConfig<ICell<string>> {
    return this.configService.updateConfigByDateChange();
  }

  public addHeader(): ITableConfig<ICell<string>> {
    return this.configService.addHeader();
  }

  public deleteHeader(input: HTMLInputElement): ITableConfig<ICell<string>> {
    return this.configService.deleteHeader(input);
  }

  public updateMark(change: IChangeField<number>): ITableConfig<ICell<string>> {
    return this.configService.updateMark(change);
  }
}
