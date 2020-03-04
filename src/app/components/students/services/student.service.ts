import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpService } from '../../../common/services/http.service';
import { LocalStorageService } from '../../../common/services/local-storage.service';
import { StudentFormService } from './student-form.service';
import { FormConfig } from '../../../common/models/Form/Form-config';
import { Student } from '../../../common/models/Student';

const studentUrl: string = 'http://localhost:3000/students';

@Injectable()
export class StudentService {
  constructor(
    private _http: HttpService<Student>,
    private _storage: LocalStorageService,
    private _form: StudentFormService,
  ) { }

  private _getStorageStudent(): Student | null {
    const data: string | null = this._storage.getItem('student');
    if (data === null) {
      return null;
    }

    const student: Student = JSON.parse(data);
    return student;
  }

  private _addStorageStudent(student: Student): void {
    this._storage.addItem('student', JSON.stringify(student));
  }

  public fetchStudents(): Observable<Array<Student>> {
    return this._http.getData(studentUrl);
  }

  public addStudent(student: Student): Observable<Student> {
    return this._http.postData(studentUrl, student);
  }

  public getConfig(): FormConfig {
    const student: Student = this._getStorageStudent();
    if (student === null) {
      return this._form.config;
    }

    this._form.changeConfig(student);
    return this._form.config;
  }

  public checkEmpty(student: Student, omitKeys: Array<string>): boolean {
    return Object.keys(student).every((key: string) => {
      if (omitKeys.includes(key)) {
        return true;
      }

      return student[key] === '' || student[key] === null;
    });
  }

  public confirm(
    student: Student,
    disable: boolean,
    message: string = 'Do you want to save information?',
  ): Observable<boolean> {
    if (this.checkEmpty(student, ['id'])) {
      return of(true);
    }

    const confirmation: boolean = window.confirm(message);
    if (!confirmation) {
      this._form.clearData();
      this._storage.removeItem('student');
      return of(!confirmation);
    }

    if (disable) {
      this._addStorageStudent(student);
      return of(true);
    }

    return this.addStudent(student).pipe(
      map(() => true),
    );
  }
}
