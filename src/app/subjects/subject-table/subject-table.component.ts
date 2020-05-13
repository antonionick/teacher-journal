import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';

import { Observable, of, pipe, UnaryFunction, zip } from 'rxjs';
import { filter, map, mergeMap, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import * as SubjectsActions from '../../@ngrx/subjects/subjects.actions';
import * as SubjectsSelectors from '../../@ngrx/subjects/subjects.selectors';
import * as StudentsActions from '../../@ngrx/students/students.actions';
import * as MarksSelectors from '../../@ngrx/marks/marks.selectors';
import * as MarksActions from '../../@ngrx/marks/marks.actions';
import {
  SubjectTableBodyService,
  SubjectTableConfigService,
  SubjectTableHeaderService,
  SubjectTableService,
  TableConfigHistoryService,
} from '../services';
import { IMarksSelectStore, Mark, StatusSaveMarks } from '../../common/models/mark';
import { AppState, IMarksState, IStudentsState } from '../../@ngrx';
import { ISubjectSelectStore, Subject } from '../../common/models/subject';
import { IDataChanges, TNullable } from '../../common/models/utils';
import { IChangeField, ITableConfig, TableHeaderConfig } from 'src/app/common/models/table';
import { ButtonConfig } from 'src/app/common/models/button/button-config';
import { BaseComponent } from 'src/app/components/base/base.component';

@Component({
  selector: 'app-subject-table',
  templateUrl: './subject-table.component.html',
  styleUrls: ['./subject-table.component.scss'],
  providers: [
    SubjectTableService,
    SubjectTableConfigService,
    SubjectTableHeaderService,
    SubjectTableBodyService,
    TableConfigHistoryService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectTableComponent extends BaseComponent implements OnInit, OnDestroy {
  public isLoading: boolean;
  public subject: Subject;
  public teacherControl: FormControl;
  public saveButtonConfig: ButtonConfig;
  public config$: Observable<ITableConfig>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private tableService: SubjectTableService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
    this.isLoading = false;
  }

  private loadProcess(
    err: TNullable<Error>,
    loading: boolean,
    action: () => void,
  ): void {
    if (err !== null) {
      this.router.navigate(['subjects']);
    } else if (!loading) {
      action();
    }
  }

  private loadProcessSubject():
    UnaryFunction<Observable<ISubjectSelectStore>, Observable<ISubjectSelectStore>> {
    return pipe(
      tap(({ id, subject, err, loading }) => {
        if (subject !== null) {
          return this.setSubject(subject);
        }

        this.loadProcess(err, loading, () => {
          this.store.dispatch(SubjectsActions.loadOneSubject({ id }));
        });
      }),
      filter(({ subject }) => subject !== null),
    );
  }

  private loadProcessStudents():
    UnaryFunction<Observable<IStudentsState>, Observable<IStudentsState>> {
    return pipe(
      tap(({ students, loading, loaded, error }) => {
        if (students.length > 0 || loaded) {
          return this.tableService.subjectStudents = students;
        }

        this.loadProcess(error, loading, () => {
          this.store.dispatch(StudentsActions.loadStudents());
        });
      }),
      filter(({ students, loaded }) => students.length > 0 || loaded),
    );
  }

  private loadProcessMarks():
    UnaryFunction<Observable<IMarksSelectStore>, Observable<IMarksSelectStore>> {
    return pipe(
      tap(({ id, marks, loading, error }) => {
        if (marks !== null) {
          return this.tableService.subjectMarks = marks;
        }

        this.loadProcess(error, loading, () => {
          this.store.dispatch(MarksActions.loadMarks({ id }));
        });
      }),
      filter(({ marks }) => marks !== null),
    );
  }

  private dispatchActionsOnSave(
    { created, updated, deleted }: IDataChanges<Mark>,
  ): StatusSaveMarks {
    const status: StatusSaveMarks = new StatusSaveMarks();

    if (created.length > 0) {
      status.created = true;
      this.store.dispatch(MarksActions.addMarks({ marks: created }));
    }
    if (updated.length > 0) {
      status.updated = true;
      this.store.dispatch(MarksActions.updateMarks({ marks: updated }));
    }
    if (deleted.length > 0) {
      status.deleted = true;
      this.store.dispatch(MarksActions.deleteMarks({ marks: deleted }));
    }

    return status;
  }

  private saveMarks(id: number): Observable<Array<Mark>> {
    const changes: IDataChanges<Mark> = this.tableService.getChanges(id);
    const status: StatusSaveMarks = this.dispatchActionsOnSave(changes);

    if (!status.created && !status.updated && !status.deleted) {
      return this.store.select(MarksSelectors.selectMarksBySubject, { id }).pipe(
        map(({ marks }) => marks),
      );
    }

    const loadMarks: () => UnaryFunction<Observable<IMarksState>, Observable<IMarksState>> = () => {
      return pipe(
        tap(({ error }) => {
          if (error && error.status !== 404) {
            alert(`Marks: ${ error.message }`);
          }

          this.store.dispatch(MarksActions.loadMarks({ id }));
        }),
      );
    };

    const selectMarks: () => Observable<TNullable<Array<Mark>>> = () => {
      return this.store.select(MarksSelectors.selectMarksBySubject, { id }).pipe(
        filter(({ loaded }, index) => loaded && index > 0),
        take(1),
        map(({ marks }) => marks === null ? [] : marks),
      );
    };

    return this.store.pipe(
      select(MarksSelectors.selectMarksState),
      filter(({ adding, updating, deleting }) => !adding && !updating && !deleting),
      take(1),
      loadMarks(),
      switchMap(() => selectMarks()),
    );
  }

  private saveSubject(): Observable<Subject> {
    const isChanged: boolean = this.teacherControl.value !== this.subject.teacher;
    if (!isChanged) {
      return of(this.subject);
    }

    this.subject.teacher = this.teacherControl.value;
    this.store.dispatch(SubjectsActions.updateSubject({ subject: this.subject }));

    const selectSubject: () => Observable<Subject> = () => {
      return this.store.pipe(
        select(SubjectsSelectors.selectSubjectById, { id: this.subject.id }),
        tap(({ err }) => {
          if (err) {
            alert(`Subject: ${ err.message }`);
          }
        }),
        map(({ subject }) => subject),
      );
    };

    return this.store.pipe(
      select('subjects'),
      filter(({ updating }) => !updating),
      take(1),
      mergeMap(() => selectSubject()),
    );
  }

  private setSubject(subject: Subject): void {
    this.subject = { ...subject };
    this.teacherControl.setValue(subject.teacher);
  }

  public ngOnInit(): void {
    this.isLoading = true;
    this.subject = new Subject();
    this.teacherControl = new FormControl('');
    this.saveButtonConfig = new ButtonConfig();

    this.store.pipe(
      select(SubjectsSelectors.selectSubjectByUrl),
      this.loadProcessSubject(),
      switchMap(() => this.store.pipe(select('students'))),
      this.loadProcessStudents(),
      switchMap(() => this.store.pipe(select(MarksSelectors.selectMarksByUrl))),
      this.loadProcessMarks(),
      take(1),
      tap(() => {
        this.config$ = this.tableService.createConfig();
        this.cdr.detectChanges();
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe();
  }

  public onSave(): void {
    const { id } = this.subject;
    this.saveButtonConfig.disable = true;

    zip(this.saveMarks(id), this.saveSubject()).pipe(
      take(1),
      tap(([marks, subject]) => {
        this.setSubject(subject);
        this.tableService.subjectMarks = marks;
        this.saveButtonConfig = { ...this.saveButtonConfig, disable: false };
        this.tableService.updateConfig();
      }),
    ).subscribe();
  }

  public onUpdateHeaders(): void {
    this.tableService.updateConfigByDateChanges();
  }

  public onAddDateHeader(): void {
    this.tableService.addHeader();
  }

  public onDeleteDateHeader(header: TableHeaderConfig): void {
    this.tableService.deleteHeader(header);
  }

  public onChangeMark(change: IChangeField<number>): void {
    this.tableService.updateMark(change);
  }
}
