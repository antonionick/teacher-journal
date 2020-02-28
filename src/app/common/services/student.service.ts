import { Injectable } from '@angular/core';
import { Student } from '../models/Student';
import { students } from '../../../../mock-data/students';
import { getProperties } from '../helpers/utils';

@Injectable()
export class StudentService {
  private _students: Array<Student>;
  public get students(): Array<Student> {
    return this._students;
  }

  constructor() {
    this._students = students;
  }

  private _getMaxId(): number {
    const idArray: Array<number> = getProperties<Student, number>(this.students, 'id');
    return Math.max(...idArray);
  }

  public addStudent(data: Student): void {
    const id: number = this._getMaxId();
    data.id = id + 1;
    this._students = [...this._students, data];
  }
}
