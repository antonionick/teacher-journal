import { Component, OnInit, OnDestroy } from '@angular/core';
import { faPlus, faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { select, Store } from '@ngrx/store';

import { of, Observable } from 'rxjs';
import { takeUntil, filter, tap, take, mergeMap } from 'rxjs/operators';

import * as SubjectsActions from '../../@ngrx/subjects/subjects.actions';
import * as MarksActions from '../../@ngrx/marks/marks.actions';
import { ISubjectState } from '../../@ngrx/subjects';
import { AppState, IMarksState } from '../../@ngrx';
import { BaseComponent } from 'src/app/components/base/base.component';
import { Subject } from 'src/app/common/models/subject';
import { TNullable } from '../../common/models/utils';
import { Mark } from 'src/app/common/models/mark';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.scss'],
})
export class SubjectListComponent extends BaseComponent implements OnInit, OnDestroy {
  public subjects: Array<Subject>;
  public plusIcon: IconDefinition;
  public deleteIcon: IconDefinition;
  public error: TNullable<Error>;
  public isLoading: boolean;

  constructor(
    private store: Store<AppState>,
  ) {
    super();
    this.plusIcon = faPlus;
    this.deleteIcon = faTrash;
    this.error = null;
  }

  private isNeedLoad({ loaded, error }: ISubjectState): boolean {
    return !loaded && error === null;
  }

  private updateDataByState({ error, loaded }: ISubjectState): void {
    // if error because of load fail
    if (error !== null && !loaded) {
      this.error = error;
    }
  }

  private isSubjectMarksExist({ id }: Subject, { marks }: IMarksState): boolean {
    return Array.isArray(marks[id]);
  }

  private loadMarksBySubject({ id }: Subject): Observable<IMarksState> {
    this.store.dispatch(MarksActions.loadMarks({ id }));
    return this.store.pipe(
      select('marks'),
      filter(({ loaded }) => loaded),
    );
  }

  private deleteSubjectMarks(subject: Subject): Observable<IMarksState> {
    return this.store.pipe(
      select('marks'),
      take(1),
      mergeMap((state) => {
        const isExist: boolean = this.isSubjectMarksExist(subject, state);
        return isExist ? of(state) : this.loadMarksBySubject(subject);
      }),
      take(1),
      mergeMap((state) => {
        const { id } = subject;
        const marksToDelete: Array<Mark> = state.marks[id];
        if (marksToDelete.length === 0) {
          return of(state);
        }

        this.store.dispatch(MarksActions.deleteMarks({ marks: marksToDelete }));
        return this.store.pipe(select('marks'));
      }),
      filter(({ deleting }, index) => !deleting && index > 0),
      take(1),
      mergeMap(() => this.loadMarksBySubject(subject)),
      take(1),
    );
  }

  public ngOnInit(): void {
    this.isLoading = true;

    this.store.pipe(
      select('subjects'),
      filter(({ loading }) => !loading),
      tap((state) => {
        if (!this.isNeedLoad(state)) {
          return;
        }

        this.store.dispatch(SubjectsActions.loadSubjects({ loaded: state.subjects }));
      }),
      filter((state) => !this.isNeedLoad(state)),
      take(1),
      tap((state) => {
        this.isLoading = false;
        this.subjects = state.subjects;
        this.updateDataByState(state);
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe();
  }

  public onDelete(subject: Subject): void {
    this.isLoading = true;
    this.store.dispatch(SubjectsActions.deleteSubject({ subject }));

    this.store.pipe(
      select('subjects'),
      filter(({ deleting }) => !deleting),
      take(1),
      tap((state) => {
        this.updateDataByState(state);
        this.subjects = state.subjects;
      }),
      mergeMap(({ error }) => (
        error !== null ? of(null) : this.deleteSubjectMarks(subject)
      )),
      take(1),
      tap(() => this.isLoading = false),
    ).subscribe();
  }
}
