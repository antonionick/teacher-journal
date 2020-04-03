import { createAction, props } from '@ngrx/store';

import { Subject } from '../../common/models/subject';

// tslint:disable:typedef
export const loadSubjects = createAction('[Subject List] LOAD_SUBJECTS');
export const loadSubjectsSuccess = createAction(
  '[Load Subjects Effect] LOAD_SUBJECTS_SUCCESS',
  props<{ subjects: Array<Subject> }>(),
);
export const loadSubjectsError = createAction(
  '[Load Subject Effect] LOAD_SUBJECTS_ERROR',
  props<{ error: Error | string }>(),
);
export const addSubjectServer = createAction(
  '[Subject Form] ADD_SUBJECT_SERVER',
  props<{ subject: Subject }>(),
);
export const addSubjectServerSuccess = createAction(
  '[Add Subject Effect] ADD_SUBJECT_SERVER_SUCCESS',
  props<{ subject: Subject }>(),
);
export const addSubjectServerError = createAction(
  '[Add Subject Effect] ADD_SUBJECT_SERVER_ERROR',
  props<{ error: Error | string }>(),
);
export const getDraftSubjectLocalStorage = createAction(
  '[Subject Form] GET_DRAFT_SUBJECT_LOCALSTORAGE',
);
export const updateDraftSubjectLocalStorage = createAction(
  '[Subject Form] UPDATE_DRAFT_SUBJECT_LOCALSTORAGE',
  props<{ draftSubject: Subject }>(),
);
export const updateDraftSubject = createAction(
  '[LocalStorage Subject Effect] UPDATE_DRAFT_SUBJECT',
  props<{ draftSubject: Subject }>(),
);
