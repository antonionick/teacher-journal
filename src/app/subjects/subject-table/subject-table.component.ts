import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';

import { Observable, of, pipe, Subscription, throwError, UnaryFunction } from 'rxjs';
import { takeUntil, switchMap, tap, filter } from 'rxjs/operators';

import * as SubjectsActions from '../../@ngrx/subjects/subjects.actions';
import * as SubjectsSelectors from '../../@ngrx/subjects/subjects.selectors';
import * as StudentsActions from '../../@ngrx/students/students.actions';
import * as MarksSelectors from '../../@ngrx/marks/marks.selectors';
import * as MarksActions from '../../@ngrx/marks/marks.actions';
import {
  SubjectTableService,
  SubjectTableConfigService,
  SubjectTableBodyService,
  SubjectTableHeaderService,
  TableConfigHistoryService,
} from '../services';
import { IMarksSelectStore, Mark } from '../../common/models/mark';
import { AppState, IStudentsState } from '../../@ngrx';
import { Subject, ISubjectSelectStore } from '../../common/models/subject';
import { TNullable } from '../../common/models/utils/tnullable';
import { ITableConfig, ICell, IChangeField } from 'src/app/common/models/table';
import { ButtonConfig } from 'src/app/common/models/button/button-config';
import { BaseComponent } from 'src/app/components/base/base.component';
import { IDataChanges } from '../../common/models/utils/data-changes';

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
})
export class SubjectTableComponent extends BaseComponent implements OnInit {
  public isLoading: boolean;
  public subject: Subject;
  public config: ITableConfig<ICell<string>>;
  public teacherControl: FormControl;
  public saveButtonConfig: ButtonConfig;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private tableService: SubjectTableService,
  ) {
    super();
    this.isLoading = false;
  }

  private loadProcess(
    err: TNullable<Error>,
    loading: boolean,
    action: () => void,
  ): void {
    if (err) {
      this.router.navigate(['subjects']);
    } else if (!loading) {
      action();
    }
  }

  private loadProcessSubject(idObj: { id: number }):
    UnaryFunction<Observable<ISubjectSelectStore>, Observable<ISubjectSelectStore>> {
    return pipe(
      tap(({ subject, err, loading }) => {
        if (subject !== null) {
          return this.setSubject(subject);
        }

        this.loadProcess(err, loading, () => {
          this.store.dispatch(SubjectsActions.loadOneSubject({ id: idObj.id }));
        });
      }),
      filter(({ subject }) => subject !== null),
    );
  }

  private loadProcessStudents():
    UnaryFunction<Observable<IStudentsState>, Observable<IStudentsState>> {
    return pipe(
      tap(({ students, loading, error }) => {
        if (students.length > 0) {
          return this.tableService.subjectStudents = students;
        }

        this.loadProcess(error, loading, () => {
          this.store.dispatch(StudentsActions.loadStudents());
        });
      }),
      filter(({ students }) => students.length > 0),
    );
  }

  private loadProcessMarks(idObj: { id: number }):
    UnaryFunction<Observable<IMarksSelectStore>, Observable<IMarksSelectStore>> {
    return pipe(
      tap(({ marks, loading, loaded, error }) => {
        if (marks.length > 0 || !error && loaded) {
          return this.tableService.subjectMarks = marks;
        }

        this.loadProcess(error, loading, () => {
          this.store.dispatch(MarksActions.loadMarks({ id: idObj.id }));
        });
      }),
      filter(({ marks, loaded, error }) => marks.length > 0 || !error && loaded),
    );
  }

  private dispatchActionsOnSave(
    id: number,
    { created, updated, deleted }: IDataChanges<Mark>,
  ): number {
    let countCalls: number = 0;

    if (created.length > 0) {
      countCalls++;
      this.store.dispatch(MarksActions.addMarks({ id, marks: created }));
    }
    if (updated.length > 0) {
      countCalls++;
      this.store.dispatch(MarksActions.updateMarksServer({ id, marks: updated }));
    }
    if (deleted.length > 0) {
      countCalls++;
      this.store.dispatch(MarksActions.deleteMarks({ id, marks: deleted }));
    }

    return countCalls;
  }

  private setSubject(subject: Subject): void {
    this.subject = subject;
    this.teacherControl.setValue(subject.teacher);
  }

  public ngOnInit(): void {
    let idObj: { id: number } = { id: -1 };

    this.config = null;
    this.isLoading = true;
    this.subject = new Subject();
    this.teacherControl = new FormControl('');
    this.saveButtonConfig = new ButtonConfig();

    let sub: Subscription = new Subscription();
    sub = this.route.paramMap.pipe(
      switchMap((params) => {
        const id: number = idObj.id = +params.get('id');
        return this.store.pipe(select(SubjectsSelectors.selectSubjectById, { id }));
      }),
      this.loadProcessSubject(idObj),
      switchMap(() => {
        return this.store.pipe(select('students'));
      }),
      this.loadProcessStudents(),
      switchMap(() => {
        return this.store.pipe(select(MarksSelectors.selectMarksBySubject, { id: idObj.id }));
      }),
      this.loadProcessMarks(idObj),
      takeUntil(this.unsubscribe$),
    ).subscribe({
      next: (): void => {
        this.config = this.tableService.createConfig();
        sub.unsubscribe();
      },
    });
  }

  public onSave(): void {
    this.saveButtonConfig.disable = true;

    const { id } = this.subject;
    const changes: IDataChanges<Mark> = this.tableService.getChanges(id);
    const isChanged: boolean = this.teacherControl.value !== this.subject.teacher;
    let countCall: number;

    if (isChanged) {
      this.subject.teacher = this.teacherControl.value;
    }

    countCall = this.dispatchActionsOnSave(id, changes);

    if (countCall === 0) {
      this.saveButtonConfig.disable = false;
      return;
    }

    let countLoads: number = 0;
    let sub: Subscription = new Subscription();
    sub = this.store.pipe(
      select(MarksSelectors.selectMarksBySubject, { id }),
      filter((state, index) => index >= countCall),
      switchMap((state) => {
        const { error, loaded } = state;
        if (error !== null && error.status !== 404) {
          return throwError(error);
        }

        if (loaded && countLoads === 0) {
          countLoads = 1;
          this.store.dispatch(MarksActions.loadMarks({ id }));
        }
        return of(state);
      }),
      filter(({ loaded }, index) => loaded && index > 0),
    ).subscribe({
      next: ({ marks }) => {
        this.tableService.subjectMarks = marks;
        this.config = this.tableService.createConfig();
        this.saveButtonConfig.disable = false;
        sub.unsubscribe();
      },
      error: (error) => {
        alert(error.message);
        this.router.navigate(['subjects']);
      },
    });
    //
    // const subscriptionSaveSubject: Subscription = this.subjectService
    //   .updateSubject(this.subject)
    //   .subscribe(() => subscriptionSaveSubject.unsubscribe());
  }

  public onUpdateHeaders(): void {
    this.config = this.tableService.updateConfig();
  }

  public onAddDateHeader(): void {
    this.config = this.tableService.addHeader();
  }

  public onDeleteDateHeader(event: MouseEvent): void {
    const classList: DOMTokenList = (event.target as HTMLInputElement).classList;

    if (
      !(classList.contains('table__item_input-date-picker') && (event.ctrlKey || event.metaKey))
    ) {
      return;
    }

    this.config = this.tableService.deleteHeader(event.target as HTMLInputElement);
  }

  public onChangeMark(change: IChangeField<number>): void {
    this.config = this.tableService.updateMark(change);
  }
}
