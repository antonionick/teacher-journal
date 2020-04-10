import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';

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
      switchMap(({ student: newStudent, move }) => (
        this.studentService.addStudentServer(newStudent).pipe(
          map((student) => {
            if (move) {
              this.router.navigate(['students']);
            }
            return studentActions.addStudentServerSuccess({ student });
          }),
          catchError((error) => of(studentActions.addStudentServerError({
            student: newStudent,
            error,
          }))),
        )
      )),
    )
  ));

  public addStudentServerSuccess$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(studentActions.addStudentServerSuccess),
      map(() => studentActions.removeDraftStudentLocalStorage()),
    )
  ));

  public addStudentServerError: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(studentActions.addStudentServerError),
      map(({ student }) => studentActions.updateDraftStudentLocalStorage({
        draftStudent: student,
      })),
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
        localStorage.setItem('draftStudent', JSON.stringify(draftStudent));
        return studentActions.updateDraftStudent({ draftStudent });
      }),
    )
  ));

  public removeDraftStudentLocalStorage$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(studentActions.removeDraftStudentLocalStorage),
      map(() => {
        localStorage.removeItem('draftStudent');
        return studentActions.updateDraftStudent({ draftStudent: null });
      }),
    )
  ));

  constructor(
    private router: Router,
    private actions$: Actions,
    private studentService: StudentService,
  ) {}
}
