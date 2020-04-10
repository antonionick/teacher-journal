import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, pluck, switchMap } from 'rxjs/operators';

import * as MarksActions from './marks.actions';
import { MarkService } from '../../common/services';
import * as HttpUtils from '../../common/utils/http';

@Injectable()
export class MarksEffects {
  public loadMarks$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(MarksActions.loadMarks),
      pluck('id'),
      switchMap((id) => (
        this.marksService.fetchMarks(HttpUtils.getParamsWithKey('subjectId', [id])).pipe(
          map((marks) => MarksActions.loadMarksSuccess({ id, marks })),
          catchError((error) => of(MarksActions.loadMarksError({ id, error }))),
        )
      )),
    )
  ));

  public addMarks$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(MarksActions.addMarks),
      switchMap(({ id, marks }) => (
        this.marksService.postMarks(marks).pipe(
          map((response) => MarksActions.addMarksSuccess({ id, marks: response })),
          catchError((error) => of(MarksActions.addMarksError({ id, error }))),
        )
      )),
    )
  ));

  public updateMarks$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(MarksActions.updateMarksServer),
      switchMap(({ id, marks }) => (
        this.marksService.putMarks(marks).pipe(
          map((response) => MarksActions.updateMarksServerSuccess({ id, marks: response })),
          catchError((error) => of(MarksActions.updateMarksServerError({ id, error }))),
        )
      )),
    )
  ));

  public deleteMarks$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(MarksActions.deleteMarks),
      switchMap(({ id, marks }) => (
        this.marksService.deleteMarks(marks).pipe(
          map(() => MarksActions.deleteMarksSuccess({ id, marks })),
          catchError((error) => {
            return of(MarksActions.deleteMarksError({ id, error }));
          }),
        )
      )),
    )
  ));

  constructor(private actions: Actions, private marksService: MarkService) {}
}
