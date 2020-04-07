import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MemoizedSelector } from '@ngrx/store/src/selector';

import { Student } from '../../common/models/student';
import { AppState } from '../app.state';
import { IStudentsState } from './students.state';
import { TNullable } from '../../common/models/utils/tnullable';

const selectFeature: MemoizedSelector<AppState, IStudentsState> =
  createFeatureSelector<AppState, IStudentsState>('students');

export const selectDraftStudent: MemoizedSelector<AppState, TNullable<Student>> = createSelector(
  selectFeature,
  (studentState) => studentState.draftStudent,
);

export const selectStudents: MemoizedSelector<AppState, Array<Student>> = createSelector(
  selectFeature,
  (studentState) => studentState.students,
);
