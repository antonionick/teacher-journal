import { Component, Input, OnInit } from '@angular/core';
import { Student } from '../../../common/models/Student';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss'],
})
export class StudentTableComponent implements OnInit {
  @Input()
  public data: Array<Student>;
  @Input('columnHeaders')
  public displayedColumns: Array<string>;

  constructor() {}

  public ngOnInit(): void {}

}
