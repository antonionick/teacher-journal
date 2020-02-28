import { Component, OnInit } from '@angular/core';
import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { Student } from '../../../common/models/Student';
import { students } from '../../../../../mock-data/students';
import { TableHeaderConfig } from '../../../common/models/Table/Table-header-config';
import { getProperties } from '../../../common/helpers/utils';

@Component({
  selector: 'app-student-page',
  templateUrl: './student-page.component.html',
  styleUrls: ['./student-page.component.scss'],
})
export class StudentPageComponent implements OnInit {
  public students: Array<Student>;
  public headers: Array<TableHeaderConfig>;
  public plusIcon: IconDefinition = faPlus;

  constructor() {
    this.students = students;
  }

  private _getMaxId(): number {
    const idArray: Array<number> = getProperties<Student, number>(this.students, 'id');
    return Math.max(...idArray);
  }

  public ngOnInit(): void {
    this.headers = [
      {
        value: 'id',
        isSort: true,
      },
      {
        value: 'name',
        isSort: true,
      },
      {
        value: 'lastName',
        isSort: true,
      },
      {
        value: 'address',
        isSort: true,
      },
      {
        value: 'description',
        isSort: true,
      },
    ];
  }

  public addData(data: Student): void {
    const id: number = this._getMaxId();
    data.id = id + 1;
    this.students = [...this.students, data];
  }
}
