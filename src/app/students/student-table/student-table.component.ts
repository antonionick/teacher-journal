import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { faPlus, faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { select, Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { filter, map, mergeMap, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import * as StudentsActions from '../../@ngrx/students/students.actions';
import * as MarksActions from '../../@ngrx/marks/marks.actions';
import * as HttpUtils from '../../common/utils/http';
import { AppState, IStudentsState, selectStudents } from '../../@ngrx';
import { BaseComponent } from '../../components';
import { Student } from '../../common/models/student';
import { StudentTableService } from '../services';
import { ITableConfig, ITableBodyConfig } from 'src/app/common/models/table';
import { MarkService } from '../../common/services';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss'],
  providers: [StudentTableService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentTableComponent extends BaseComponent implements OnInit {
  public students$: Observable<Array<Student>>;
  public config$: Observable<ITableConfig>;
  public plusIcon: IconDefinition;
  public trashIcon: IconDefinition;
  public error: Error;
  public isLoading: boolean;

  constructor(
    private store: Store<AppState>,
    private tableService: StudentTableService,
    private markService: MarkService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
    this.isLoading = false;
    this.plusIcon = faPlus;
    this.trashIcon = faTrash;
    this.students$ = store.pipe(select(selectStudents));
  }

  private isNeedLoad({ loaded, error }: IStudentsState): boolean {
    return !loaded && error === null;
  }

  private updateDataByState({ error, loaded }: IStudentsState): void {
    // if error because of load fail
    if (error !== null && !loaded) {
      this.error = error;
    }
  }

  private deleteStudentMarks(id: number): Observable<null> {
    return this.store.pipe(
      select('marks'),
      take(1),
      switchMap((marksState) => this.store.pipe(
        select('subjects'),
        take(1),
        map((subjectsState) => this.markService.isAllMarksLoaded(marksState, subjectsState)),
        mergeMap((isLoaded) => (
          isLoaded ?
            of(this.markService.getMarksByKey('studentId', id, marksState)) :
            this.markService.fetchMarks(HttpUtils.getParamsWithKey('studentId', [id]))
        )),
      )),
      mergeMap((marks) => {
        if (marks.length === 0) {
          return of(null);
        }

        this.store.dispatch(MarksActions.deleteMarks({ marks }));
        return this.store.pipe(
          select('marks'),
          filter(({ deleting }, index) => !deleting && index > 0),
          map(() => null),
        );
      }),
      take(1),
    );
  }

  private updateConfig(): void {
    this.students$.pipe(
      tap((students) => this.tableService.updateTableBody(students)),
      takeUntil(this.unsubscribe$),
    ).subscribe();
  }

  private getConfig(students: Array<Student>): void {
    this.config$ = this.tableService.getConfig(students);
    this.cdr.markForCheck();
  }

  public ngOnInit(): void {
    this.store.pipe(
      select('students'),
      filter(({ loading }) => !loading),
      tap((state) => this.updateDataByState(state)),
      tap((state) => {
        if (!this.isNeedLoad(state)) {
          return this.isLoading = false;
        }

        this.isLoading = true;
        this.store.dispatch(StudentsActions.loadStudents());
      }),
      filter((state) => !this.isNeedLoad(state)),
      take(1),
      tap(({ students }) => this.getConfig(students)),
    ).subscribe();

    this.updateConfig();
  }

  public onDelete({ id }: ITableBodyConfig): void {
    this.isLoading = true;
    this.store.dispatch(StudentsActions.deleteStudent({ id: +id.value }));

    this.students$.pipe(
      take(1),
      switchMap(() => this.deleteStudentMarks(+id.value)),
      mergeMap(() => this.markService.updateMarksStateAfterDelete(this.store)),
      tap(() => this.isLoading = false),
    ).subscribe();
  }
}
