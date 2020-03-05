import { Component, OnInit } from '@angular/core';
import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { Student } from '../../../common/models/Student';
import { StudentService } from '../services/student.service';
import { TableHeaderConfig } from '../../../common/models/Table/Table-header-config';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss'],
})
export class StudentTableComponent implements OnInit {
  public data: Array<Student>;
  public displayedColumns: Array<TableHeaderConfig>;
  public plusIcon: IconDefinition = faPlus;

  constructor(private _studentService: StudentService) { }

  public ngOnInit(): void {
    this._studentService.fetchStudents().subscribe((students: Array<Student>) => {
      this.data = <Array<Student>>students;
    });

    this.displayedColumns = [
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
}
