import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { SubjectService } from '../../subjects/services';
import * as SubjectsActions from './subjects.actions';

@Injectable()
export class SubjectsEffects {
  public subjects$: Observable<Action> = createEffect(() => (
    this.actions.pipe(
      ofType(SubjectsActions.loadSubjects),
      switchMap(() => (
        this.subjectService.fetchSubjectsServer().pipe(
          map((subjects) => SubjectsActions.loadSubjectsSuccess({ subjects })),
          catchError((error) => of(SubjectsActions.loadSubjectsError(error))),
        )
      )),
    )
  ));

  constructor(private actions: Actions, private subjectService: SubjectService) {}
}
