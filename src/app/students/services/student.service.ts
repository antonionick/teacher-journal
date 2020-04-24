import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Student } from '../../common/models/student';
import { urlProvider } from '../../url';

const { students: studentUrl } = urlProvider;

@Injectable()
export class StudentService {
  constructor(
    private http: HttpClient,
  ) { }

  public fetchStudentsServer(): Observable<Array<Student>> {
    return this.http.get<Array<Student>>(studentUrl);
  }

  public addStudentServer(student: Student): Observable<Student> {
    return this.http.post<Student>(studentUrl, student);
  }

  public deleteStudent(id: number): Observable<Student> {
    return this.http.delete<Student>(`${studentUrl}/${id}`);
  }

  public isChanged(sourceStudent: Student, student: Student): boolean {
    return !Object.keys(student).every((key: string) => {
      return sourceStudent[key] === student[key] || student[key] === null;
    });
  }
}
