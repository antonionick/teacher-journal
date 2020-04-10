import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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
      switchMap(({ loaded: loadedSubjects }) => (
        this.subjectService.fetchSubjects(
          HttpUtils.getParamsExcludesById<Subject>(loadedSubjects),
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
      switchMap(({ subject, move }) => (
        this.subjectService.addSubjectServer(subject).pipe(
          map((addedSubject) => {
            if (move) {
              this.router.navigate(['subjects']);
            }
            return SubjectsActions.addSubjectServerSuccess({ subject: addedSubject });
          }),
          catchError((error) => of(SubjectsActions.addSubjectServerError({ subject, error }))),
        )
      )),
    )
  ));

  public addSubjectServerSuccess$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(SubjectsActions.addSubjectServerSuccess),
      map(() => SubjectsActions.removeDraftSubjectLocalStorage()),
    )
  ));

  public addSubjectServerError$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(SubjectsActions.addSubjectServerError),
      map(({ subject }) => SubjectsActions.updateDraftSubjectLocalStorage({
        draftSubject: subject,
      })),
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
        localStorage.setItem('draftSubject', JSON.stringify(draftSubject));
        return SubjectsActions.updateDraftSubject({ draftSubject });
      }),
    )
  ));

  public removeDraftSubjectLocalStorage$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(SubjectsActions.removeDraftSubjectLocalStorage),
      map(() => {
        localStorage.removeItem('draftSubject');
        return SubjectsActions.updateDraftSubject({ draftSubject: null });
      }),
    )
  ));

  constructor(
    private router: Router,
    private actions: Actions,
    private subjectService: SubjectService,
  ) {}
}
