import { Action, createReducer, on } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store/src/models';

import * as Actions from './subjects.actions';
import { initialState, ISubjectState } from './subjects.state';

const reducer: ActionReducer<ISubjectState> = createReducer(
  initialState,
  on(Actions.loadSubjects, (state, action) => {
    return { ...state, loading: true };
  }),
  on(Actions.loadSubjectsSuccess, (state, { subjects }) => {
    return { ...state, subjects, loading: false, loaded: true };
  }),
  on(Actions.loadSubjectsError, (state, { error }) => {
    return { ...state, error, loading: false, loaded: false };
  }),
  on(Actions.addSubjectServerSuccess, (state, { subject }) => {
    return { ...state, subjects: [...state.subjects, subject] };
  }),
  on(Actions.addSubjectServerError, (state, { error }) => {
    return { ...state, error };
  }),
  on(Actions.updateDraftSubject, (state, { draftSubject }) => {
    return { ...state, draftSubject };
  }),
);

export function subjectsReducer(state: ISubjectState | undefined, action: Action): ISubjectState {
  return reducer(state, action);
}
