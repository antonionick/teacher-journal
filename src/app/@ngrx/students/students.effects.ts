import { Injectable } from '@angular/core';

import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import * as studentActions from './students.actions';
import { StudentService } from '../../students/services/student.service';
import { Student } from '../../common/models/student';

@Injectable()
export class StudentsEffects {
  public loadStudents$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(studentActions.loadStudents),
      switchMap(() => (
        this.studentService.fetchStudentsServer().pipe(
          map((students) => studentActions.loadStudentsSuccess({ students })),
          catchError((error) => of(studentActions.loadStudentsError({ error }))),
        )
      )),
    )
  ));

  public addStudentServer$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(studentActions.addStudentServer),
      switchMap(({ student: newStudent }) => (
        this.studentService.addStudentServer(newStudent).pipe(
          map((student) => studentActions.addStudentServerSuccess({ student })),
          catchError((error) => of(studentActions.addStudentServerError({ error }))),
        )
      )),
    )
  ));

  public getDraftStudentLocalStorage$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(studentActions.getDraftStudentLocalStorage),
      map(() => {
        const draftStudent: Student = JSON.parse(localStorage.getItem('draftStudent'));
        return studentActions.updateDraftStudent({ draftStudent });
      }),
    )
  ));

  public updateDraftStudentLocalStorage$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(studentActions.updateDraftStudentLocalStorage),
      map(({ draftStudent }) => {
        if (draftStudent === null) {
          localStorage.removeItem('draftStudent');
        } else {
          localStorage.setItem('draftStudent', JSON.stringify(draftStudent));
        }

        return studentActions.updateDraftStudent({ draftStudent });
      }),
    )
  ));

  constructor(
    private actions$: Actions,
    private studentService: StudentService,
  ) {}
}
