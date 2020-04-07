import { Action, ActionCreator, createAction, props } from '@ngrx/store';

import { Student } from '../../common/models/Student';
import { FunctionWithParametersType, TypedAction } from '@ngrx/store/src/models';
import { TNullable } from '../../common/models/utils/tnullable';

// tslint:disable:typedef
export const loadStudents = createAction('[(APP)] LOAD_STUDENTS');
export const loadStudentsSuccess = createAction(
  '[Load Students Effect] LOAD_STUDENTS_SUCCESS',
  props<{ students: Array<Student> }>(),
);
export const loadStudentsError = createAction(
  '[Load Students Effect] LOAD_STUDENTS_ERROR',
  props<{ error: Error | string }>(),
);
export const addStudentServer = createAction(
  '[Student Form] ADD_STUDENT_SERVER',
  props<{ student: Student }>(),
);
export const addStudentServerSuccess = createAction(
  '[Add Student Server Effect] ADD_STUDENT_SERVER_SUCCESS',
  props<{ student: Student }>(),
);
export const addStudentServerError = createAction(
  '[Add Student Server Effect] ADD_STUDENT_SERVER_ERROR',
  props<{ error: Error }>(),
);
export const getDraftStudentLocalStorage = createAction(
  '[Student Form (APP)] GET_DRAFT_STUDENT_LOCALSTORAGE',
);
export const updateDraftStudentLocalStorage = createAction(
  '[Student Form (APP)] UPDATE_DRAFT_STUDENT_LOCALSTORAGE',
  props<{ draftStudent: TNullable<Student> }>(),
);
export const updateDraftStudent = createAction(
  '[Update Draft Student LocalStorage Effect] UPDATE_DRAFT_STUDENT',
  props<{ draftStudent: TNullable<Student> }>(),
);
