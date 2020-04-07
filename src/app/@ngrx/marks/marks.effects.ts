import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as MarksActions from './marks.actions';
import { MarkService } from '../../common/services';
import * as HttpUtils from '../../common/utils/http';

@Injectable()
export class MarksEffects {
  public loadMarks$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(MarksActions.loadMarks),
      switchMap(({ id }) => (
        this.marksService.fetchMarks(HttpUtils.getParamsWithKey('subjectId', [id])).pipe(
          map((marks) => MarksActions.loadMarksSuccess({ id, marks })),
          catchError((error) => of(MarksActions.loadMarksError({ error }))),
        )
      )),
    )
  ));

  public addMarks: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(MarksActions.addMarks),
      switchMap(({ id, marks }) => (
        this.marksService.postMarks(marks).pipe(
          map(() => MarksActions.addMarksSuccess({ id, marks })),
          catchError((error) => of(MarksActions.addMarksError({ error }))),
        )
      )),
    )
  ));

  public updateMarks: Observable<Action> = createEffect(() => (
    this.actions.pipe(
     ofType(MarksActions.updateMarks),
     switchMap(({ id, marks }) => (
       this.marksService.putMarks(marks).pipe(
         map(() => MarksActions.updateMarksSuccess({ id, marks })),
         catchError((error) => of(MarksActions.updateMarksError({ error }))),
       )
     )),
    )
  ));

  public deleteMarks: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(MarksActions.deleteMarks),
      switchMap(({ id, marks }) => (
        this.marksService.deleteMarks(marks).pipe(
          map(() => MarksActions.deleteMarksSuccess({ id, marks })),
          catchError((error) => of(MarksActions.deleteMarksError({ error }))),
        )
      )),
    )
  ));

  constructor(private actions: Actions, private marksService: MarkService) {}
}
