import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Student } from '../../common/models/student';
import { urlProvider } from '../../url';
import { TableBodyConfig, TableCellConfig, TableHeaderConfig } from '../../common/models/table';

const { students: studentUrl } = urlProvider;

const displayedColumns: Array<TableHeaderConfig> = [
  new TableHeaderConfig({
    value: 'id',
    sort: true,
  }),
  new TableHeaderConfig({
    value: 'delete',
    isVisible: false,
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
    private http: HttpClient,
  ) {
    this.displayedColumns = displayedColumns;
  }

  public fetchStudentsServer(): Observable<Array<Student>> {
    return this.http.get<Array<Student>>(studentUrl);
  }

  public addStudentServer(student: Student): Observable<Student> {
    return this.http.post<Student>(studentUrl, student);
  }

  public isChanged(sourceStudent: Student, student: Student): boolean {
    return !Object.keys(student).every((key: string) => {
      return sourceStudent[key] === student[key] || student[key] === null;
    });
  }

  public addDeleteButtonToStudentConfig(student: TableBodyConfig): void {
    student.delete = new TableCellConfig({ isExternal: true });
  }

  public getTableBodyConfig(students: Array<Student>): Array<TableBodyConfig> {
    if (students.length === 0) {
      return [];
    }

    const studentKeys: Array<string> = Object.keys(students[0]);

    return students.map((student) => {
      const studentConfig: TableBodyConfig = {};

      studentKeys.map((key) => {
        studentConfig[key] = new TableCellConfig({ value: student[key] });
      });
      this.addDeleteButtonToStudentConfig(studentConfig);

      return studentConfig;
    });
  }
}
