import { Component, OnInit } from '@angular/core';
import { Student } from '../../../common/models/Student';
import { students } from '../../../../../mock-data/students';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-student-page',
  templateUrl: './student-page.component.html',
  styleUrls: ['./student-page.component.scss'],
})
export class StudentPageComponent implements OnInit {
  public students: Array<Student>;
  public headers: Array<string>;
  public plusIcon = faPlus;

  constructor() {
    this.students = students;
    this.headers = ['id', 'name', 'lastName', 'address', 'description'];
  }

  public ngOnInit(): void {}
}
