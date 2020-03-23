import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, tap, mergeMap, catchError } from 'rxjs/operators';

import { ITableConfig, ICell, TableHeaderConfig, IChangeField } from '../../common/models/table';
import { StudentService } from 'src/app/students/services/student.service';
import { Subject } from '../../common/models/subject';
import { Student } from 'src/app/common/models/student';
import { Mark } from 'src/app/common/models/mark/mark';
import { SubjectService } from './subject.service';
import { SubjectTableConfigService } from './subject-table-config.service';
import { Options } from 'src/app/common/models/useful/http-options';
import { filterByIds } from 'src/app/common/helpers/utils';
import { MarkService } from 'src/app/common/services';

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
export class SubjectTableService {
  private students: Array<Student>;
  private marks: Array<Mark>;

  constructor(
    private configService: SubjectTableConfigService,
    private studentService: StudentService,
    private subjectService: SubjectService,
    private markService: MarkService,
  ) {
    this.students = [];
    this.marks = [];
  }

  public fetchSubject(value: string, key: string = 'name'): Observable<Subject> {
    const options: Options = new Options({
      params: new HttpParams().set(key, value),
    });

    return this.subjectService.fetchSubjectServer(options).pipe(
      map((response) => {
        const subject: Subject = response[0] || null;
        if (subject === null) {
          throw Error('this subject is not exist');
        }

        return subject;
      })
    );
  }

  public fetchSubjectStudents(studentsID: Array<number>): Observable<Array<Student>> {
    return this.studentService.fetchStudentsServer().pipe(
      map((students: Array<Student>) => {
        return this.students = filterByIds(students, studentsID);
      }),
      catchError((error) => {
        console.log(error);
        return [];
      }),
    );
  }

  public fetchSubjectMarks(subjectId: number): Observable<Array<Mark>> {
    const options: Options = new Options({
      params: new HttpParams().set('subjectId', `${subjectId}`),
    });

    return this.markService.fetchMarks(options).pipe(
      tap((marks) => this.marks = marks),
    );
  }

  public fetchAndSetConfigData({ id, students }: Subject): Observable<null> {
    return this.fetchSubjectStudents(students).pipe(
      mergeMap((response = []) => {
        this.students = response;
        return this.fetchSubjectMarks(id);
      }),
      mergeMap((response = []) => {
        this.marks = response;
        return of(null);
      }),
    );
  }

  public createConfig(): ITableConfig<ICell<string>> {
    return this.configService.createConfig(headerConfig, this.students, this.marks);
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
