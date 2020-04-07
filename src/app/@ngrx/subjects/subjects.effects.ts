import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { SubjectService } from '../../subjects/services';
import * as SubjectsActions from './subjects.actions';
import { Subject } from '../../common/models/subject';
import * as HttpUtils from '../../common/utils/http';

@Injectable()
export class SubjectsEffects {
  public loadSubjects$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(SubjectsActions.loadSubjects),
      switchMap(({ loaded }) => (
        this.subjectService.fetchSubjects(
          HttpUtils.getParamsExcludesById<Subject>(loaded),
        ).pipe(
          map((subjects) => SubjectsActions.loadSubjectsSuccess({ subjects })),
          catchError((error) => of(SubjectsActions.loadSubjectsError({ error }))),
        )
      )),
    )
  ));

  public loadOneSubject$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(SubjectsActions.loadOneSubject),
      switchMap(({ id }) => (
        this.subjectService.fetchSubject(HttpUtils.getParamsWithId(id)).pipe(
          map((subject) => SubjectsActions.loadOneSubjectSuccess({ subject })),
          catchError((error) => of(SubjectsActions.loadOneSubjectError({ error }))),
        )
      )),
    )
  ));

  public addSubjectServer$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(SubjectsActions.addSubjectServer),
      switchMap(({ subject }) => (
        this.subjectService.addSubjectServer(subject).pipe(
          map((addedSubject) => SubjectsActions.addSubjectServerSuccess(
            { subject: addedSubject },
          )),
          catchError((error) => of(SubjectsActions.addSubjectServerError({ error }))),
        )
      )),
    )
  ));

  public getDraftSubjectLocalStorage: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(SubjectsActions.getDraftSubjectLocalStorage),
      map(() => {
        const draftSubject: Subject = JSON.parse(localStorage.getItem('draftSubject'));
        return SubjectsActions.updateDraftSubject({ draftSubject });
      }),
    )
  ));

  public updateDraftSubjectLocalStorage$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(SubjectsActions.updateDraftSubjectLocalStorage),
      map(({ draftSubject }) => {
        if (draftSubject === null) {
          localStorage.removeItem('draftSubject');
        } else {
          localStorage.setItem('draftSubject', JSON.stringify(draftSubject));
        }

        return SubjectsActions.updateDraftSubject({ draftSubject });
      }),
    )
  ));

  constructor(private actions: Actions, private subjectService: SubjectService) {}
}
