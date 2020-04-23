import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as SubjectsActions from './subjects.actions';
import * as HttpUtils from '../../common/utils/http';
import { SubjectService } from '../../subjects/services';
import { Subject } from '../../common/models/subject';

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

  public addSubject$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(SubjectsActions.addSubject),
      switchMap(({ subject, move }) => (
        this.subjectService.addSubjectServer(subject).pipe(
          map((addedSubject) => {
            if (move) {
              this.router.navigate(['subjects']);
            }
            return SubjectsActions.addSubjectSuccess({ subject: addedSubject });
          }),
          catchError((error) => of(SubjectsActions.addSubjectError({ subject, error }))),
        )
      )),
    )
  ));

  public addSubjectSuccess$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(SubjectsActions.addSubjectSuccess),
      map(() => SubjectsActions.removeDraftSubjectLocalStorage()),
    )
  ));

  public addSubjectError$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(SubjectsActions.addSubjectError),
      map(({ subject }) => SubjectsActions.updateDraftSubjectLocalStorage({
        draftSubject: subject,
      })),
    )
  ));

  public updateSubject$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(SubjectsActions.updateSubject),
      switchMap(({ subject }) => (
        this.subjectService.updateSubject(subject).pipe(
          map(() => SubjectsActions.updateSubjectSuccess({ subject })),
          catchError((error) => of(SubjectsActions.updateSubjectError({ error }))),
        )
      )),
    )
  ));

  public deleteSubject$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(SubjectsActions.deleteSubject),
      switchMap(({ subject }) => (
        this.subjectService.deleteSubject(subject).pipe(
          map(() => SubjectsActions.deleteSubjectSuccess({ subject })),
          catchError((error) => of(SubjectsActions.deleteSubjectError({ error }))),
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
  ) { }
}
