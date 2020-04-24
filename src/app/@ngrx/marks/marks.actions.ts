import { HttpErrorResponse } from '@angular/common/http';

import { createAction, props } from '@ngrx/store';

import { Mark } from '../../common/models/mark';

// tslint:disable:typedef
export const loadMarks = createAction(
  '[(APP)] LOAD_MARKS',
  props<{ id: number }>(),
);
export const loadMarksSuccess = createAction(
  '[Load Marks Effect] LOAD_MARKS_SUCCESS',
  props<{ id: number, marks: Array<Mark> }>(),
);
export const loadMarksError = createAction(
  '[Load Marks Effect] LOAD_MARKS_ERROR',
  props<{ id: number, error: HttpErrorResponse }>(),
);
export const loadMarksBySubjects = createAction(
  'LOAD_MARKS_BY_SUBJECTS',
  props<{ ids: Array<number> }>(),
);
export const loadMarksBySubjectsSuccess = createAction(
  '[Load Marks By Subjects Effect] LOAD_MARKS_BY_SUBJECTS_SUCCESS',
  props<{ marks: { [subjectId: string]: Array<Mark> } }>(),
);
export const loadMarksBySubjectsError = createAction(
  '[Load Marks By Subjects Effect] LOAD_MARKS_BY_SUBJECTS_ERROR',
  props<{ ids: Array<number>, error: HttpErrorResponse }>(),
);
export const addMarks = createAction(
  '[Subject Table] ADD_MARKS',
  props<{ marks: Array<Mark> }>(),
);
export const addMarksSuccess = createAction(
  '[Add Marks Effect] ADD_MARKS_SUCCESS',
);
export const addMarksError = createAction(
  '[Add Marks Effect] ADD_MARKS_ERROR',
  props<{ error: HttpErrorResponse }>(),
);
export const updateMarks = createAction(
  '[Subject Table] UPDATE_MARKS',
  props<{ marks: Array<Mark> }>(),
);
export const updateMarksSuccess = createAction(
  '[Update Marks Effect] UPDATE_MARKS_SUCCESS',
);
export const updateMarksError = createAction(
  '[Update Marks Effect] UPDATE_MARKS_ERROR',
  props<{ error: HttpErrorResponse }>(),
);
export const deleteMarks = createAction(
  '[Subject Table] DELETE_MARKS',
  props<{ marks: Array<Mark> }>(),
);
export const deleteMarksSuccess = createAction(
  '[Delete Marks Effect] DELETE_MARKS_SUCCESS',
);
export const deleteMarksError = createAction(
  '[Delete Marks Effect] DELETE_MARKS_ERROR',
  props<{ error: HttpErrorResponse }>(),
);
