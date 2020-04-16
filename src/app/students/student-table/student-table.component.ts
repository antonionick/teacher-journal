import { Component, OnInit } from '@angular/core';
import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as StudentsActions from '../../@ngrx/students/students.actions';
import { AppState, IStudentsState, selectStudents } from '../../@ngrx';
import { BaseComponent } from '../../components';
import { Student } from '../../common/models/student';
import { StudentService } from '../services/student.service';
import { TNullable } from '../../common/models/utils';
import { ITableConfig } from 'src/app/common/models/table';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss'],
})
export class StudentTableComponent extends BaseComponent implements OnInit {
  public students$: Observable<Array<Student>>;
  public config: TNullable<ITableConfig<Student>>;
  public plusIcon: IconDefinition;
  public error: Error | string;
  public isLoading: boolean;

  constructor(private store: Store<AppState>, private studentService: StudentService) {
    super();
    this.config = null;
    this.isLoading = false;
    this.plusIcon = faPlus;
    this.students$ = store.pipe(select(selectStudents));
  }

  private isNeedLoad({ loading, loaded, error }: IStudentsState): boolean {
    this.isLoading = false;

    if (loading) {
      this.isLoading = true;
    } else if (error) {
      this.error = error;
    } else if (!loaded) {
      return true;
    }

    return false;
  }

  public ngOnInit(): void {
    this.store.pipe(
      select('students'),
      takeUntil(this.unsubscribe$),
    ).subscribe({
      next: (studentsState) => {
        if (!this.isNeedLoad(studentsState)) {
          return;
        }

        this.store.dispatch(StudentsActions.loadStudents());
      },
    });

    this.students$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe({
      next: (students) => {
        this.config = {
          headers: this.studentService.displayedColumns,
          body: students,
        };
      },
    });
  }
}
