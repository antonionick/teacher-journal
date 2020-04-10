import { createReducer, on, Action, ActionReducer } from '@ngrx/store';

import { initialState, IStudentsState } from './students.state';
import * as Actions from './students.actions';

const reducer: ActionReducer<IStudentsState> = createReducer(
  initialState,
  on(Actions.loadStudents, (state) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(Actions.loadStudentsSuccess, (state, { students }) => {
    return {
      ...state,
      students,
      error: null,
      loading: false,
      loaded: true,
    };
  }),
  on(Actions.loadStudentsError, (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
      loaded: false,
    };
  }),
  on(Actions.addStudentServerSuccess, (state, { student }) => {
    return {
      ...state,
      students: [...state.students, student],
    };
  }),
  on(Actions.addStudentServerError, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),
  on(Actions.updateDraftStudent, (state, { draftStudent }) => {
    return {
      ...state,
      draftStudent,
    };
  }),
);

export function studentsReducer(
  state: IStudentsState | undefined,
  action: Action,
): IStudentsState {
  return reducer(state, action);
}
