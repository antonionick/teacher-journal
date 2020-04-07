import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';

import { Observable, pipe, Subscription, UnaryFunction } from 'rxjs';
import { takeUntil, switchMap, tap, filter, mergeMap } from 'rxjs/operators';

import * as SubjectsActions from '../../@ngrx/subjects/subjects.actions';
import * as SubjectsSelectors from '../../@ngrx/subjects/subjects.selectors';
import * as StudentsActions from '../../@ngrx/students/students.actions';
import * as MarksSelectors from '../../@ngrx/marks/marks.selectors';
import * as MarksActions from '../../@ngrx/marks/marks.actions';
import {
  SubjectService,
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
    private subjectService: SubjectService,
  ) {
    super();
    this.isLoading = false;
  }

  private loadProcess(
    countCalls: { count: number },
    err: TNullable<string | Error>,
    loading: boolean,
    action: () => void,
  ): void {
    if (err) {
      this.router.navigate(['subjects']);
    } else if (!loading) {
      action();
    }

    countCalls.count++;
  }

  private loadProcessSubject(idObj: { id: number }, countCalls: { count: number }):
    UnaryFunction<Observable<ISubjectSelectStore>, Observable<ISubjectSelectStore>> {
    return pipe(
      tap(({ subject, err, loading }) => {
        if (subject !== null) {
          return this.setSubject(subject);
        }

        this.loadProcess(countCalls, err, loading, () => {
          this.store.dispatch(SubjectsActions.loadOneSubject({ id: idObj.id }));
        });
      }),
      filter(({ subject }) => subject !== null),
    );
  }

  private loadProcessStudents(countCalls: { count: number }):
    UnaryFunction<Observable<IStudentsState>, Observable<IStudentsState>> {
    return pipe(
      tap(({ students, loading, error }) => {
        if (students.length > 0) {
          return this.tableService.subjectStudents = students;
        }

        this.loadProcess(countCalls, error, loading, () => {
          this.store.dispatch(StudentsActions.loadStudents());
        });
      }),
      filter(({ students }) => students.length > 0),
    );
  }

  private loadProcessMarks(idObj: { id: number }, countCalls: { count: number }):
    UnaryFunction<Observable<IMarksSelectStore>, Observable<IMarksSelectStore>> {
    return pipe(
      tap(({ marks, loading, error }) => {
        if (marks.length > 0 || !loading && !error && countCalls.count > 0) {
          return this.tableService.subjectMarks = marks;
        }

        this.loadProcess(countCalls, error, loading, () => {
          this.store.dispatch(MarksActions.loadMarks({ id: idObj.id }));
        });
      }),
      filter(({ marks, loading, error }) => {
        return marks.length > 0 || !loading && !error && countCalls.count > 1;
      }),
    );
  }

  private setSubject(subject: Subject): void {
    this.subject = subject;
    this.teacherControl.setValue(subject.teacher);
  }

  public ngOnInit(): void {
    let idObj: { id: number } = { id: -1 };
    let countCalls: { count: number } = { count: 0 };

    this.config = null;
    this.isLoading = true;
    this.subject = new Subject();
    this.teacherControl = new FormControl('');
    this.saveButtonConfig = new ButtonConfig();

    this.route.paramMap.pipe(
      switchMap((params) => {
        const id: number = idObj.id = +params.get('id');
        return this.store.pipe(select(SubjectsSelectors.selectSubjectById, { id }));
      }),
      this.loadProcessSubject(idObj, countCalls),
      switchMap(() => {
        countCalls.count = 0;
        return this.store.pipe(select('students'));
      }),
      this.loadProcessStudents(countCalls),
      switchMap(() => {
        countCalls.count = 0;
        return this.store.pipe(select(MarksSelectors.selectMarksBySubject, { id: idObj.id }));
      }),
      this.loadProcessMarks(idObj, countCalls),
      takeUntil(this.unsubscribe$),
    ).subscribe({
      next: (): void => {
        this.config = this.tableService.createConfig();
      },
    });
  }

  public onUpdateHeaders(): void {
    this.config = this.tableService.updateConfig();
  }

  public onSave(): void {
    // if (!this.subject) {
    //   return;
    // }
    this.saveButtonConfig.disable = true;

    const changes: IDataChanges<Mark> = this.tableService.getChanges(this.subject.id);
    const isChanged: boolean = this.teacherControl.value !== this.subject.teacher;
    if (isChanged) {
      this.subject.teacher = this.teacherControl.value;
    }
    // const subscription: Subscription = this.tableService
    //   .saveChanges(this.subject.id)
    //   .pipe(
    //     mergeMap(() => {
    //       return this.tableService.fetchSubjectMarks(this.subject.id);
    //     }),
    //     tap((marks = []) => this.tableService.subjectMarks = marks),
    //   )
    //   .subscribe({
    //     next: () => {
    //       this.saveButtonConfig.disable = false;
    //       this.config = this.tableService.createConfig();
    //       subscription.unsubscribe();
    //     },
    //     error: () => {
    //       console.error('bad internet connection!');
    //     },
    //   });
    //
    // const subscriptionSaveSubject: Subscription = this.subjectService
    //   .updateSubject(this.subject)
    //   .subscribe(() => subscriptionSaveSubject.unsubscribe());
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
