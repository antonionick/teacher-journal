import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpService, LocalStorageService } from '../../common/services';
import { StudentFormService } from './student-form.service';
import { IFormConfig } from '../../common/models/Form';
import { Student } from '../../common/models/student';
import { urlProvider } from '../../url';
import { TNullable } from '../../common/models/tnullable';

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

  public addStorageStudent(student: Student): void {
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

    this.form.updateConfigData(student);
    return this.form.config;
  }

  public clearConfigData(): void {
    this.form.clearData();
    this.storage.removeItem('student');
  }

  public checkEmpty(student: Student): boolean {
    const emptyStudent: Student = new Student();

    return Object.keys(student).every((key: string) => {
      if (emptyStudent[key] === student[key] || student[key] === null) {
        return true;
      }
    });
  }
}
