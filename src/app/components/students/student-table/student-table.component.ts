import { Component, Input, OnInit } from '@angular/core';
import { Student } from '../../../common/models/Student';

import { TableHeaderConfig } from '../../../common/entities/Table/TableHeaderConfig';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss'],
})
export class StudentTableComponent implements OnInit {
  @Input()
  public data: Array<Student>;
  @Input('columnHeaders')
  public displayedColumns: Array<TableHeaderConfig>;

  constructor() {}

  public ngOnInit(): void {}
}
