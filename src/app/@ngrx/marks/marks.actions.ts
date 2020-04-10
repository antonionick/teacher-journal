import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

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
export const addMarks = createAction(
  '[Subject Table] ADD_MARKS',
  props<{ id: number, marks: Array<Mark> }>(),
);
export const addMarksSuccess = createAction(
  '[Add Marks Effect] ADD_MARKS_SUCCESS',
  props<{ id: number, marks: Array<Mark> }>(),
);
export const addMarksError = createAction(
  '[Add Marks Effect] ADD_MARKS_ERROR',
  props<{ id: number, error: HttpErrorResponse }>(),
);
export const updateMarksServer = createAction(
  '[Subject Table] UPDATE_MARKS_SERVER',
  props<{ id: number, marks: Array<Mark> }>(),
);
export const updateMarksServerSuccess = createAction(
  '[Update Marks Server Effect] UPDATE_MARKS_SERVER_SUCCESS',
  props<{ id: number, marks: Array<Mark> }>(),
);
export const updateMarksServerError = createAction(
  '[Update Marks Server Effect] UPDATE_MARKS_SERVER_ERROR',
  props<{ id: number, error: HttpErrorResponse }>(),
);
export const deleteMarks = createAction(
  '[Subject Table] DELETE_MARKS',
  props<{ id: number, marks: Array<Mark> }>(),
);
export const deleteMarksSuccess = createAction(
  '[Delete Marks Effect] DELETE_MARKS_SUCCESS',
  props<{ id: number, marks: Array<Mark> }>(),
);
export const deleteMarksError = createAction(
  '[Delete Marks Effect] DELETE_MARKS_ERROR',
  props<{ id: number, error: HttpErrorResponse }>(),
);
