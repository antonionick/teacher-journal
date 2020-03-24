import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, tap, mergeMap, catchError } from 'rxjs/operators';

import { ITableConfig, ICell, TableHeaderConfig, IChangeField } from '../../common/models/table';
import { StudentService } from 'src/app/students/services/student.service';
import { Subject } from '../../common/models/subject';
import { Student } from 'src/app/common/models/student';
import { Mark, IMarksByDate } from 'src/app/common/models/mark';
import { SubjectService } from './subject.service';
import { SubjectTableConfigService } from './subject-table-config.service';
import { Options } from 'src/app/common/models/useful/http-options';
import { filterByIds } from 'src/app/common/helpers/utils';
import { MarkService } from 'src/app/common/services';
import { IDataChanges } from 'src/app/common/models/useful/data-changes';
import { getEmptyDate } from 'src/app/common/helpers/date';

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
      }),
    );
  }

  public fetchSubjectStudents(studentsID: Array<number>): Observable<Array<Student>> {
    return this.studentService.fetchStudentsServer().pipe(
      map((students: Array<Student>) => {
        return (this.students = filterByIds(students, studentsID));
      }),
      catchError(() => {
        return [];
      }),
    );
  }

  public fetchSubjectMarks(subjectId: number): Observable<Array<Mark>> {
    const options: Options = new Options({
      params: new HttpParams().set('subjectId', `${subjectId}`),
    });

    return this.markService.fetchMarks(options);
  }

  public fetchConfigData({ id, students }: Subject): Observable<null> {
    return this.fetchSubjectStudents(students).pipe(
      mergeMap((response = []) => {
        this.students = response;
        return this.fetchSubjectMarks(id);
      }),
      mergeMap((response = []) => {
        this.marks = this.getMarksByDate(response);
        return of(null);
      }),
    );
  }

  public postSubjectMarks(marks: Array<Mark>): void {
    this.markService.postMark(marks[0]).subscribe({
      next(): void {
        //
      },
    });
  }

  public putSubjectMarks(marks: Array<Mark>): void {
    this.markService.putMark(marks[0]).subscribe({
      next(): void {
        //
      },
    });
  }

  public deleteSubjectMarks(marks: Array<Mark>): void {
    this.markService.deleteMark(marks[0].id).subscribe({
      next(): void {
        //
      },
    });
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

  public saveChanges(subjectId: number): void {
    const changes: IDataChanges<Mark> = this.configService.getChanges(this.marks, subjectId);
    if (changes.deleted.length > 0) {
      this.deleteSubjectMarks(changes.deleted);
    }
    if (changes.created.length > 0) {
      this.postSubjectMarks(changes.created);
    }
    if (changes.updated.length > 0) {
      this.putSubjectMarks(changes.updated);
    }
  }
}
