import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';

import { Observable, pipe, UnaryFunction, of, zip } from 'rxjs';
import { takeUntil, switchMap, tap, filter, take, map } from 'rxjs/operators';

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
import { IMarksSelectStore, Mark, StatusSaveMarks } from '../../common/models/mark';
import { AppState, IStudentsState } from '../../@ngrx';
import { Subject, ISubjectSelectStore } from '../../common/models/subject';
import { TNullable } from '../../common/models/utils';
import { ITableConfig, ICell, IChangeField } from 'src/app/common/models/table';
import { ButtonConfig } from 'src/app/common/models/button/button-config';
import { BaseComponent } from 'src/app/components/base/base.component';
import { IDataChanges } from '../../common/models/utils';

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

  private loadProcessMarks():
    UnaryFunction<Observable<IMarksSelectStore>, Observable<IMarksSelectStore>> {
    return pipe(
      tap(({ id, marks, loading, loaded, error }) => {
        if (marks !== null) {
          return this.tableService.subjectMarks = marks;
        }

        this.loadProcess(error, loading, () => {
          this.store.dispatch(MarksActions.loadMarks({ id }));
        });
      }),
      filter(({ marks, loaded, error }) => marks !== null),
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

    return this.store.pipe(
      select(MarksSelectors.selectMarksState),
      filter(({ adding, updating, deleting }) => !adding && !updating && !deleting),
      take(1),
      tap(({ error }) => {
        if (error && error.status !== 404) {
          alert(`Marks: ${ error.message }`);
        }

        this.store.dispatch(MarksActions.loadMarks({ id }));
      }),
      switchMap(() => this.store.select(MarksSelectors.selectMarksBySubject, { id })),
      filter(({ loaded }, index) => loaded && index > 0),
      take(1),
      map(({ marks }) => marks === null ? [] : marks),
    );
  }

  private saveSubject(): Observable<Subject> {
    const isChanged: boolean = this.teacherControl.value !== this.subject.teacher;

    if (!isChanged) {
      return of(this.subject);
    }
    this.subject.teacher = this.teacherControl.value;
    this.store.dispatch(SubjectsActions.updateSubject({ subject: this.subject }));

    return this.store.pipe(
      select('subjects'),
    ).pipe(
      filter(({ updating }) => !updating),
      take(1),
      switchMap(() => (
        this.store.pipe(
          select(SubjectsSelectors.selectSubjectById, { id: this.subject.id }),
        )
      )),
      tap(({ err }) => {
        if (err) {
          alert(`Subject: ${ err.message }`);
        }
      }),
      map(({ subject }) => subject),
    );
  }

  private setSubject(subject: Subject): void {
    this.subject = { ...subject };
    this.teacherControl.setValue(subject.teacher);
  }

  public ngOnInit(): void {
    this.config = null;
    this.isLoading = true;
    this.subject = new Subject();
    this.teacherControl = new FormControl('');
    this.saveButtonConfig = new ButtonConfig();

    this.store.pipe(
      select(SubjectsSelectors.selectSubjectByUrl),
      this.loadProcessSubject(),
      switchMap(() => {
        return this.store.pipe(select('students'));
      }),
      this.loadProcessStudents(),
      switchMap(() => {
        return this.store.pipe(select(MarksSelectors.selectMarksByUrl));
      }),
      this.loadProcessMarks(),
      take(1),
      takeUntil(this.unsubscribe$),
    ).subscribe({
      next: (): void => {
        this.config = this.tableService.createConfig();
      },
    });
  }

  public onSave(): void {
    const { id } = this.subject;
    this.saveButtonConfig.disable = true;

    zip(
      this.saveMarks(id),
      this.saveSubject(),
    ).pipe(
      take(1),
    ).subscribe({
      next: ([marks, subject]) => {
        this.setSubject(subject);
        this.tableService.subjectMarks = marks;
        this.config = this.tableService.createConfig();
        this.saveButtonConfig.disable = false;
      },
    });
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
