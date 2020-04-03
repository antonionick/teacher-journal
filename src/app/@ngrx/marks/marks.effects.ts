import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';

import * as MarksActions from './marks.actions';
import { MarkService } from '../../common/services';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable()
export class MarksEffects {
  public marks$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(MarksActions.loadMarks),
      switchMap(() => (
        this.marksService.fetchMarks().pipe(
          map((marks) => MarksActions.loadMarksSuccess({ marks })),
          catchError((error) => of(MarksActions.loadMarksError(error))),
        )
      )),
    )
  ));

  constructor(private actions: Actions, private marksService: MarkService) {}
}
