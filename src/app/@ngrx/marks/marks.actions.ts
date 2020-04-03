import { createAction, props } from '@ngrx/store';

import { Mark } from '../../common/models/mark';

export const loadMarks = createAction('[Mark Effects] Load Marks');
export const loadMarksSuccess = createAction(
  '[Mark Effects] Load Marks Success',
  props<{ marks: Array<Mark> }>(),
);
export const loadMarksError = createAction('[Mark Effects] Load Marks Error', props<Error>());
export const addMark = createAction('[Mark] Add mark', props<Mark>());
export const updateMark = createAction('[Mark] Update mark', props<Mark>());
export const deleteMark = createAction('[Mark] Delete mark', props<Mark>());
