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
  props<{ error: Error }>(),
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
  props<{ error: Error }>(),
);
export const updateMarks = createAction(
  '[Subject Table] UPDATE_MARKS',
  props<{ id: number, marks: Array<Mark> }>(),
);
export const updateMarksSuccess = createAction(
  '[Update Marks Effect] UPDATE_MARKS_SUCCESS',
  props<{ id: number, marks: Array<Mark> }>(),
);
export const updateMarksError = createAction(
  '[Update Marks Effect] UPDATE_MARKS_ERROR',
  props<{ error: Error }>(),
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
  props<{ error: Error }>(),
);
// export const addMark = createAction('[Mark] Add mark', props<Mark>());
// export const updateMark = createAction('[Mark] Update mark', props<Mark>());
// export const deleteMark = createAction('[Mark] Delete mark', props<Mark>());
