import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Observable, of, zip } from 'rxjs';
import { catchError, map, pluck, switchMap } from 'rxjs/operators';

import * as MarksActions from './marks.actions';
import * as HttpUtils from '../../common/utils/http';
import { MarkService } from '../../common/services';
import { Mark } from 'src/app/common/models/mark';

@Injectable()
export class MarksEffects {
  public loadMarks$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
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

  public loadMarksBySubjects$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(MarksActions.loadMarksBySubjects),
      pluck('ids'),
      map((ids) => {
        const requests: Array<Observable<Array<Mark>>> = ids.map((id) => (
          this.marksService.fetchMarks(HttpUtils.getParamsWithKey('subjectId', [id]))
        ));

        return { ids, requests };
      }),
      switchMap(({ ids, requests }) => (
        zip(requests).pipe(
          map((res) => {
            const marksBySubject: { [id: string]: Array<Mark> } = res.reduce((obj, marks) => {
              const id: number = marks[0].subjectId;
              obj[id] = marks;
              return obj;
            }, {});

            return MarksActions.loadMarksBySubjectsSuccess({ marks: marksBySubject });
          }),
          catchError((error) => of(MarksActions.loadMarksBySubjectsError({ ids, error }))),
        )
      )),
    )
  ));

  public addMarks$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(MarksActions.addMarks),
      switchMap(({ marks }) => (
        this.marksService.postMarks(marks).pipe(
          map(() => MarksActions.addMarksSuccess()),
          catchError((error) => of(MarksActions.addMarksError({ error }))),
        )
      )),
    )
  ));

  public updateMarks$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(MarksActions.updateMarks),
      switchMap(({ marks }) => (
        this.marksService.putMarks(marks).pipe(
          map(() => MarksActions.updateMarksSuccess()),
          catchError((error) => of(MarksActions.updateMarksError({ error }))),
        )
      )),
    )
  ));

  public deleteMarks$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(MarksActions.deleteMarks),
      switchMap(({ marks }) => (
        this.marksService.deleteMarks(marks).pipe(
          map(() => MarksActions.deleteMarksSuccess()),
          catchError((error) => of(MarksActions.deleteMarksError({ error }))),
        )
      )),
    )
  ));

  constructor(private actions$: Actions, private marksService: MarkService) { }
}
