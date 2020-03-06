import { Component, OnInit, OnDestroy } from '@angular/core';
import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { Subscription } from 'rxjs';

import { Student } from '../../common/models/Student';
import { StudentService } from '../services/student.service';
import { ITableHeaderConfig } from '../../common/models/Table/Table-header-config';

const displayedColumns: Array<ITableHeaderConfig> = [
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

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss'],
})
export class StudentTableComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  public data: Array<Student>;
  public displayedColumns: Array<ITableHeaderConfig>;
  public plusIcon: IconDefinition = faPlus;

  constructor(private studentService: StudentService) {
    this.displayedColumns = displayedColumns;
  }

  public ngOnInit(): void {
    this.subscription = this.studentService.fetchStudentsServer()
      .subscribe({
        next: (students: Array<Student>) => {
          this.data = <Array<Student>>students;
        },
      });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
