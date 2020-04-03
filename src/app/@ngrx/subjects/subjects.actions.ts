import { createAction, props } from '@ngrx/store';

import { Subject } from '../../common/models/subject';

export const loadSubjects = createAction('[Subject Effects] Load Subjects');
export const loadSubjectsSuccess = createAction(
  '[Subject Effects] Load Subjects Success',
  props<{ subjects: Array<Subject> }>(),
);
export const loadSubjectsError = createAction(
  '[Subject Effects] Load Subjects Error',
  props<Error>(),
);
export const addSubject = createAction('[Subject Form] Add Subject', props<Subject>());
export const updateSubject = createAction(
  '[Subject Form | Table] Update Subject',
  props<Subject>(),
);
export const deleteSubject = createAction('[Subject] Delete Subject', props<Subject>());
