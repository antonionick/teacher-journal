import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpService } from '../../common/services';
import { Student } from '../../common/models/student';
import { urlProvider } from '../../url';
import { TableHeaderConfig } from '../../common/models/table';

const { students: studentUrl } = urlProvider;

const displayedColumns: Array<TableHeaderConfig> = [
  new TableHeaderConfig({
    value: 'id',
    sort: true,
  }),
  new TableHeaderConfig({
    value: 'name',
    sort: true,
  }),
  new TableHeaderConfig({
    value: 'lastName',
    sort: true,
  }),
  new TableHeaderConfig({
    value: 'address',
    sort: true,
  }),
  new TableHeaderConfig({
    value: 'description',
    sort: true,
  }),
];

@Injectable()
export class StudentService {
  public displayedColumns: Array<TableHeaderConfig>;

  constructor(
    private http: HttpService<Student>,
  ) {
    this.displayedColumns = displayedColumns;
  }

  public fetchStudentsServer(): Observable<Array<Student>> {
    return this.http.getDataArray(studentUrl);
  }

  public addStudentServer(student: Student): Observable<Student> {
    return this.http.postData(studentUrl, student);
  }

  public isChanged(sourceStudent: Student, student: Student): boolean {
    return !Object.keys(student).every((key: string) => {
      return sourceStudent[key] === student[key] || student[key] === null;
    });
  }
}
