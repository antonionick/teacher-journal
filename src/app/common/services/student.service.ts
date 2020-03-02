import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

import { Student } from '../models/Student';

const studentUrl: string = 'http://localhost:3000/students';

@Injectable()
export class StudentService {
  private _students: Array<Student>;
  public get students(): Array<Student> {
    return this._students;
  }

  constructor(private _http: HttpClient) {
    this.fetchStudents().subscribe((data: Array<Student>) => {
      this._students = data;
    });
  }

  private _handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error(`An error occurred: ${error.error.message}`);
    } else {
      console.error(`Error status: ${error.status}\n Error body: ${error.message}`);
    }

    return throwError('Something bad happened; please try again later.');
  }

  public fetchStudents(): Observable<Array<Student>> {
    return this._http.get<Array<Student>>(studentUrl).pipe(retry(3), catchError(this._handleError));
  }

  public addStudent(student: Student): Observable<void> {
    if (!this.students) {
      return;
    }

    return this._http.post<Student>(studentUrl, student).pipe(
      map((data) => {
        this._students = [...this._students, data];
      }),
      catchError(this._handleError),
    );
  }
}
