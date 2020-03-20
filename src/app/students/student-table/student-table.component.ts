import { Component, OnInit, OnDestroy } from '@angular/core';
import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { Subscription } from 'rxjs';

import { Student } from '../../common/models/student';
import { StudentService } from '../services/student.service';
import { TableHeaderConfig } from '../../common/models/table/table-header-config';
import { ITableConfig } from 'src/app/common/models/table/index';

const displayedColumns: Array<TableHeaderConfig> = [
  new TableHeaderConfig({
    value: 'id',
    sort: true,
  }),
  new TableHeaderConfig({
    value: 'name',
    sort: true,
  }),
  new TableHeaderConfig({
    value: 'lastName',
    sort: true,
  }),
  new TableHeaderConfig({
    value: 'address',
    sort: true,
  }),
  new TableHeaderConfig({
    value: 'description',
    sort: true,
  }),
];

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss'],
})
export class StudentTableComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  public config: ITableConfig<Student>;
  public plusIcon: IconDefinition = faPlus;

  constructor(private studentService: StudentService) {
    this.config = {
      headers: displayedColumns,
      body: [],
    };
  }

  public ngOnInit(): void {
    this.subscription = this.studentService.fetchStudentsServer()
      .subscribe({
        next: (students: Array<Student>) => {
          this.config = {
            headers: displayedColumns,
            body: students,
          };
        },
      });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
