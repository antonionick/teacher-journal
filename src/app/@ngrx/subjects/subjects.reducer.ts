import { Action, createReducer, on } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store/src/models';

import * as Actions from './subjects.actions';
import { initialState, ISubjectState } from './subjects.state';

const reducer: ActionReducer<ISubjectState> = createReducer(
  initialState,
  on(Actions.loadSubjects, (state) => {
    return {
      ...state,
      loadingSubjects: true,
      errorSubjects: null,
    };
  }),
  on(Actions.loadSubjectsSuccess, (state, { subjects }) => {
    return {
      ...state,
      subjects: [...state.subjects, ...subjects],
      loadingSubjects: false,
      loadedSubjects: true,
    };
  }),
  on(Actions.loadSubjectsError, (state, { error }) => {
    return {
      ...state,
      errorSubjects: error,
      loadingSubjects: false,
      loadedSubjects: false,
    };
  }),
  on(Actions.loadOneSubject, (state) => {
    return {
      ...state,
      errorSubject: null,
      loadingSubject: true,
    };
  }),
  on(Actions.loadOneSubjectSuccess, (state, { subject }) => {
    return {
      ...state,
      subjects: [...state.subjects, subject],
      loadingSubject: false,
      loadedSubject: true,
    };
  }),
  on(Actions.loadOneSubjectError, (state, { error }) => {
    return {
      ...state,
      errorSubject: error,
      loadingSubject: false,
      loadedSubject: false,
    };
  }),
  on(Actions.addSubjectServerSuccess, (state, { subject }) => {
    return {
      ...state,
      subjects: [...state.subjects, subject],
    };
  }),
  on(Actions.addSubjectServerError, (state, { error }) => {
    return {
      ...state,
      errorSubject: error,
    };
  }),
  on(Actions.updateDraftSubject, (state, { draftSubject }) => {
    return {
      ...state,
      draftSubject,
    };
  }),
);

export function subjectsReducer(state: ISubjectState | undefined, action: Action): ISubjectState {
  return reducer(state, action);
}
