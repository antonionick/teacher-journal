import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpService } from '../../common/services/http.service';
import { LocalStorageService } from '../../common/services/local-storage.service';
import { StudentFormService } from './student-form.service';
import { IFormConfig } from '../../common/models/Form/Form-config';
import { Student } from '../../common/models/Student';
import { urlProvider } from '../../url';
import { TNullable } from '../../common/models/TNullable';

const { students: studentUrl } = urlProvider;

@Injectable()
export class StudentService {
  constructor(
    private http: HttpService<Student>,
    private storage: LocalStorageService,
    private form: StudentFormService,
  ) { }

  private getStorageStudent(): TNullable<Student> {
    const data: TNullable<string> = this.storage.getItem('student');
    return JSON.parse(data);
  }

  private addStorageStudent(student: Student): void {
    this.storage.addItem('student', JSON.stringify(student));
  }

  public fetchStudentsServer(): Observable<Array<Student>> {
    return this.http.getData(studentUrl);
  }

  public addStudentServer(student: Student): Observable<Student> {
    return this.http.postData(studentUrl, student);
  }

  public getFormConfig(): IFormConfig {
    const student: Student = this.getStorageStudent();
    if (student === null) {
      return this.form.config;
    }

    this.form.updateFormData(student);
    return this.form.config;
  }

  public clearFormData(): void {
    this.form.clearData();
    this.storage.removeItem('student');
  }

  public confirmNavigation(
    student: Student,
    disable: boolean,
    message: string = 'Do you want to save information?',
  ): Observable<boolean> {
    if (this.checkEmpty(student)) {
      return of(true);
    }

    const confirmation: boolean = window.confirm(message);
    if (!confirmation) {
      this.clearFormData();
      return of(!confirmation);
    }

    if (disable) {
      this.addStorageStudent(student);
      return of(true);
    }

    return this.addStudentServer(student).pipe(map(() => true));
  }

  public checkEmpty(student: Student): boolean {
    const emptyStudent: Student = new Student();

    return Object.keys(student).every((key: string) => {
      if (emptyStudent[key] === student[key]) {
        return true;
      }
    });
  }
}
