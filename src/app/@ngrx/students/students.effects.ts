import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import * as StudentActions from './students.actions';
import { StudentService } from '../../students/services/student.service';
import { Student } from '../../common/models/student';

@Injectable()
export class StudentsEffects {
  public loadStudents$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(StudentActions.loadStudents),
      switchMap(() => (
        this.studentService.fetchStudentsServer().pipe(
          map((students) => StudentActions.loadStudentsSuccess({ students })),
          catchError((error) => of(StudentActions.loadStudentsError({ error }))),
        )
      )),
    )
  ));

  public addStudentServer$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(StudentActions.addStudentServer),
      switchMap(({ student: newStudent, move }) => (
        this.studentService.addStudentServer(newStudent).pipe(
          map((student) => {
            if (move) {
              this.router.navigate(['students']);
            }
            return StudentActions.addStudentServerSuccess({ student });
          }),
          catchError((error) => of(StudentActions.addStudentServerError({
            student: newStudent,
            error,
          }))),
        )
      )),
    )
  ));

  public addStudentServerSuccess$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(StudentActions.addStudentServerSuccess),
      map(() => StudentActions.removeDraftStudentLocalStorage()),
    )
  ));

  public addStudentServerError$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(StudentActions.addStudentServerError),
      map(({ student }) => StudentActions.updateDraftStudentLocalStorage({
        draftStudent: student,
      })),
    )
  ));

  public deleteStudent$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(StudentActions.deleteStudent),
      switchMap(({ id }) => (
        this.studentService.deleteStudent(id).pipe(
          map(() => StudentActions.deleteStudentSuccess()),
          catchError((error) => of(StudentActions.deleteStudentError({ error }))),
        )
      )),
    )
  ));

  public deleteStudentSuccess$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(StudentActions.deleteStudentSuccess),
      map(() => StudentActions.loadStudents()),
    )
  ));

  public getDraftStudentLocalStorage$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(StudentActions.getDraftStudentLocalStorage),
      map(() => {
        const draftStudent: Student = JSON.parse(localStorage.getItem('draftStudent'));
        return StudentActions.updateDraftStudent({ draftStudent });
      }),
    )
  ));

  public updateDraftStudentLocalStorage$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(StudentActions.updateDraftStudentLocalStorage),
      map(({ draftStudent }) => {
        localStorage.setItem('draftStudent', JSON.stringify(draftStudent));
        return StudentActions.updateDraftStudent({ draftStudent });
      }),
    )
  ));

  public removeDraftStudentLocalStorage$: Observable<Action> = createEffect(() => (
    this.actions$.pipe(
      ofType(StudentActions.removeDraftStudentLocalStorage),
      map(() => {
        localStorage.removeItem('draftStudent');
        return StudentActions.updateDraftStudent({ draftStudent: null });
      }),
    )
  ));

  constructor(
    private router: Router,
    private actions$: Actions,
    private studentService: StudentService,
  ) { }
}
