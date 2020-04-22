import { Action, ActionReducer, createReducer, on, select } from '@ngrx/store';

import * as Actions from './marks.actions';
import { IMarksState, initialStateMarks } from './marks.state';
import { Mark } from 'src/app/common/models/mark';

const reducer: ActionReducer<IMarksState> = createReducer(
  initialStateMarks,
  on(
    Actions.loadMarks,
    Actions.loadMarksBySubjects, (state) => {
      return {
        ...state,
        error: null,
        loading: true,
        loaded: false,
      };
    }),
  on(Actions.loadMarksSuccess, (state, { id, marks }) => {
    return {
      ...state,
      marks: { ...state.marks, [id]: marks },
      loading: false,
      loaded: true,
    };
  }),
  on(Actions.loadMarksError, (state, { id, error }) => {
    return {
      ...state,
      error,
      marks: { ...state.marks, [id]: [] },
      loading: false,
      loaded: false,
    };
  }),
  on(Actions.loadMarksBySubjectsSuccess, (state, { marks }) => {
    return {
      ...state,
      marks: { ...state.marks, ...marks },
      loading: false,
      loaded: true,
    };
  }),
  on(Actions.loadMarksBySubjectsError, (state, { ids, error }) => {
    const marks: { [key: string]: Array<Mark> } = { ...state.marks };
    ids.forEach((id) => {
      marks[id] = [];
    });

    return {
      ...state,
      error,
      marks,
      loading: false,
      loaded: false,
    };
  }),
  on(Actions.addMarks, (state) => {
    return {
      ...state,
      error: null,
      adding: true,
    };
  }),
  on(Actions.addMarksSuccess, (state) => {
    return {
      ...state,
      adding: false,
    };
  }),
  on(Actions.addMarksError, (state, { error }) => {
    return {
      ...state,
      error,
      adding: false,
    };
  }),
  on(Actions.updateMarks, (state) => {
    return {
      ...state,
      error: null,
      updating: true,
    };
  }),
  on(Actions.updateMarksSuccess, (state) => {
    return {
      ...state,
      updating: false,
    };
  }),
  on(Actions.updateMarksError, (state, { error }) => {
    return {
      ...state,
      error,
      updating: false,
    };
  }),
  on(Actions.deleteMarks, (state) => {
    return {
      ...state,
      error: null,
      deleting: true,
    };
  }),
  on(Actions.deleteMarksSuccess, (state) => {
    return {
      ...state,
      deleting: false,
    };
  }),
  on(Actions.deleteMarksError, (state, { error }) => {
    return {
      ...state,
      error,
      deleting: false,
    };
  }),
);

export function marksReducer(state: IMarksState, action: Action): IMarksState {
  return reducer(state, action);
}
