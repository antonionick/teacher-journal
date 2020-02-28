import { Component, Input } from '@angular/core';
import { Student } from '../../../common/models/Student';

import { TableHeaderConfig } from '../../../common/models/Table/Table-header-config';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss'],
})
export class StudentTableComponent {
  @Input()
  public data: Array<Student>;
  @Input('columnHeaders')
  public displayedColumns: Array<TableHeaderConfig>;
}
