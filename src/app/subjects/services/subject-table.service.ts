import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable, of, throwError, forkJoin } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';

import { ITableConfig, ICell, IChangeField } from '../../common/models/table';
import { StudentService } from 'src/app/students/services/student.service';
import { Subject } from '../../common/models/subject';
import { Student } from 'src/app/common/models/student';
import { Mark, IMarksByDate } from 'src/app/common/models/mark';
import { SubjectService } from './subject.service';
import { SubjectTableConfigService } from './subject-table-config.service';
import { Options } from 'src/app/common/models/utils/http-options';
import { filterByIds } from 'src/app/common/utils/utils';
import { MarkService } from 'src/app/common/services';
import { IDataChanges } from 'src/app/common/models/utils/data-changes';
import { getEmptyDate } from 'src/app/common/utils/date';

enum MarkActions {
  post = 'postMark',
  put = 'putMark',
  delete = 'deleteMark',
}

@Injectable()
export class SubjectTableService {
  private students: Array<Student>;
  private marks: IMarksByDate;

  constructor(
    private configService: SubjectTableConfigService,
    private studentService: StudentService,
    private subjectService: SubjectService,
    private markService: MarkService,
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

  private handleError(): Observable<never> {
    return throwError('Something bad happened; please try again later.');
  }

  private actionBySubjectMarks(action: MarkActions, marks: Array<Mark>): Observable<Array<Mark>> {
    if (marks.length === 0) {
      return of(null);
    }

    const requests$: Array<Observable<Mark>> = marks.map((item) => {
      return this.markService[action](item).pipe(
        catchError(() => {
          return this.handleError();
        }),
      );
    });

    return forkJoin(...requests$);
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

  public saveChanges(subjectId: number): Observable<Array<Array<Mark>>> {
    const changes: IDataChanges<Mark> = this.configService.getChanges(this.marks, subjectId);
    const posts$: Observable<Array<Mark>> = this.actionBySubjectMarks(
      MarkActions.post,
      changes.created,
    );
    const puts$: Observable<Array<Mark>> = this.actionBySubjectMarks(
      MarkActions.put,
      changes.updated,
    );
    const deletes$: Observable<Array<Mark>> = this.actionBySubjectMarks(
      MarkActions.delete,
      changes.deleted,
    );

    return forkJoin(posts$, puts$, deletes$);
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
