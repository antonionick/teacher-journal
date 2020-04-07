import { Action, ActionReducer, createReducer, on } from '@ngrx/store';

import * as Actions from './marks.actions';
import { IMarksState, initialState } from './marks.state';
import { Mark } from '../../common/models/mark';

const reducer: ActionReducer<IMarksState> = createReducer(
  initialState,
  on(Actions.loadMarks, (state) => {
    return { ...state, loading: true, error: null };
  }),
  on(Actions.loadMarksSuccess, (state, { id, marks }) => {
    return {
      ...state,
      marks: { ...state.marks, [id]: marks },
      loading: false,
      loaded: true,
    };
  }),
  on(Actions.loadMarksError, (state, { error }) => {
    return { ...state, error, loading: false, loaded: false };
  }),
  on(Actions.addMarksSuccess, (state, { id, marks }) => {
    return {
      ...state,
      error: null,
      marks: { ...state.marks, [id]: [...state.marks[id], ...marks] },
    };
  }),
  on(Actions.addMarksError, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),
  on(Actions.updateMarksSuccess, (state, { id, marks }) => {
    const marksById: { [key: string]: Mark } = {};
    marks.forEach((item) => marksById[item.id] = item);

    return {
      ...state,
      error: null,
      marks: {
        ...state.marks,
        [id]: state.marks[id].map((item) => marksById[item.id] || item),
      },
    };
  }),
  on(Actions.updateMarksError, (state, { error }) => {
    return {
      ...state,
      error: error,
    };
  }),
  on(Actions.deleteMarksSuccess, (state, { id, marks }) => {
    const deletedMarksById: { [key: string]: Mark } = {};
    marks.forEach((item) => deletedMarksById[item.id] = item);

    return {
      ...state,
      error: null,
      marks: {
        ...state.marks,
        [id]: state.marks[id].filter((item) => deletedMarksById[item.id]),
      },
    };
  }),
  on(Actions.deleteMarksError, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),
);

export function marksReducer(state: IMarksState, action: Action): IMarksState {
  return reducer(state, action);
}
