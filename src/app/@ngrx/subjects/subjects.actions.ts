import { createAction, props } from '@ngrx/store';

import { Subject } from '../../common/models/subject';

// tslint:disable:typedef
export const loadSubjects = createAction(
  '[(APP)] LOAD_SUBJECTS',
  props<{ loaded: Array<Subject> }>(),
);
export const loadSubjectsSuccess = createAction(
  '[Load Subjects Effect] LOAD_SUBJECTS_SUCCESS',
  props<{ subjects: Array<Subject> }>(),
);
export const loadSubjectsError = createAction(
  '[Load Subject Effect] LOAD_SUBJECTS_ERROR',
  props<{ error: Error }>(),
);
export const loadOneSubject = createAction(
  '[(APP)] LOAD_ONE_SUBJECT',
  props<{ id: number }>(),
);
export const loadOneSubjectSuccess = createAction(
  '[Load One Subject Effect] LOAD_ONE_SUBJECT_SUCCESS',
  props<{ subject: Subject }>(),
);
export const loadOneSubjectError = createAction(
  '[Load One Subject Effect] LOAD_ONE_SUBJECT_ERROR',
  props<{ error: Error }>(),
);
export const addSubject = createAction(
  '[Subject Form] ADD_SUBJECT',
  props<{ subject: Subject, move: boolean }>(),
);
export const addSubjectSuccess = createAction(
  '[Add Subject Effect] ADD_SUBJECT_SUCCESS',
  props<{ subject: Subject }>(),
);
export const addSubjectError = createAction(
  '[Add Subject Effect] ADD_SUBJECT_ERROR',
  props<{ subject: Subject, error: Error }>(),
);
export const updateSubject = createAction(
  '[Subject Table] UPDATE_SUBJECT',
  props<{ subject: Subject }>(),
);
export const updateSubjectSuccess = createAction(
  '[Update Subject Effect] UPDATE_SUBJECT_SUCCESS',
  props<{ subject: Subject }>(),
);
export const updateSubjectError = createAction(
  '[Update Subject Effect] UPDATE_SUBJECT_ERROR',
  props<{ error: Error }>(),
);
export const getDraftSubjectLocalStorage = createAction(
  '[Subject Form] GET_DRAFT_SUBJECT_LOCALSTORAGE',
);
export const updateDraftSubjectLocalStorage = createAction(
  '[Subject Form] UPDATE_DRAFT_SUBJECT_LOCALSTORAGE',
  props<{ draftSubject: Subject }>(),
);
export const removeDraftSubjectLocalStorage = createAction(
  '[Subject Form] REMOVE_DRAFT_SUBJECT_LOCALSTORAGE',
);
export const updateDraftSubject = createAction(
  '[LocalStorage Subject Effect] UPDATE_DRAFT_SUBJECT',
  props<{ draftSubject: Subject }>(),
);
