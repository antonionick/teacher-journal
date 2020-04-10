import { Action, ActionReducer, createReducer, on } from '@ngrx/store';

import * as Actions from './marks.actions';
import { IMarksState, initialState } from './marks.state';

const reducer: ActionReducer<IMarksState> = createReducer(
  initialState,
  on(Actions.loadMarks, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
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
  on(Actions.addMarks, (state) => {
    return {
      ...state,
      error: null,
    };
  }),
  on(Actions.addMarksSuccess, (state, { id, marks }) => {
    return { ...state };
  }),
  on(Actions.addMarksError, (state, { id, error }) => {
    return {
      ...state,
      error,
      marks: { ...state.marks, [id]: [] },
    };
  }),
  on(Actions.updateMarksServer, (state) => {
    return {
      ...state,
      error: null,
    };
  }),
  on(Actions.updateMarksServerSuccess, (state, { id, marks }) => {
    return { ...state };
  }),
  on(Actions.updateMarksServerError, (state, { id, error }) => {
    return {
      ...state,
      error,
      marks: { ...state.marks, [id]: [] },
    };
  }),
  on(Actions.deleteMarks, (state) => {
    return {
      ...state,
      error: null,
    };
  }),
  on(Actions.deleteMarksSuccess, (state) => {
    return { ...state };
  }),
  on(Actions.deleteMarksError, (state, { id, error }) => {
    return {
      ...state,
      error,
      marks: { ...state.marks, [id]: [] },
    };
  }),
);

export function marksReducer(state: IMarksState, action: Action): IMarksState {
  return reducer(state, action);
}
