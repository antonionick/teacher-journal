import { Component, OnInit } from '@angular/core';
import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { Student } from '../../../common/models/Student';
import { students } from '../../../../../mock-data/students';
import { TableHeaderConfig } from '../../../common/entities/Table/TableHeaderConfig';
import { getMaxId } from '../../../common/helpers/id';

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
    const id: number = getMaxId(this.students) + 1;
    data.id = id;
    this.students = [...this.students, data];
  }
}
