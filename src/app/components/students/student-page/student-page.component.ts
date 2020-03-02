import { Component, OnInit } from '@angular/core';
import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { Student } from '../../../common/models/Student';
import { TableHeaderConfig } from '../../../common/models/Table/Table-header-config';

import { StudentService } from '../../../common/services/student.service';

@Component({
  selector: 'app-student-page',
  templateUrl: './student-page.component.html',
  styleUrls: ['./student-page.component.scss'],
})
export class StudentPageComponent implements OnInit {
  public students: Array<Student>;
  public headers: Array<TableHeaderConfig>;
  public plusIcon: IconDefinition = faPlus;

  constructor(private _studentsService: StudentService) {}

  public ngOnInit(): void {
    this._studentsService.fetchStudents().subscribe((student: Array<Student>) => {
      this.students = <Array<Student>>student;
    });

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

  public addStudent(student: Student): void {
    this._studentsService.addStudent(student).subscribe(() => {
      this.students = this._studentsService.students;
    });
  }
}
