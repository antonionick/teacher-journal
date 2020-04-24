import { Action, createReducer, on } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store/src/models';

import * as Actions from './subjects.actions';
import { initialState, ISubjectState } from './subjects.state';
import { Subject } from 'src/app/common/models/subject';

const reducer: ActionReducer<ISubjectState> = createReducer(
  initialState,
  on(Actions.loadSubjects, (state) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(Actions.loadSubjectsSuccess, (state, { subjects: data }) => {
    const subjects: Array<Subject> = [...state.subjects, ...data];
    return {
      ...state,
      subjects,
      error: null,
      loading: false,
      loaded: true,
      loadedOne: false,
    };
  }),
  on(
    Actions.loadSubjectsError,
    Actions.loadOneSubjectError,
    (state, { error }) => {
      return {
        ...state,
        error,
        loading: false,
        loaded: false,
        loadedOne: false,
      };
    },
  ),
  on(Actions.loadOneSubject, (state) => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(Actions.loadOneSubjectSuccess, (state, { subject }) => {
    return {
      ...state,
      error: null,
      subjects: [...state.subjects, subject],
      loading: false,
      loadedOne: true,
    };
  }),
  on(Actions.addSubjectSuccess, (state, { subject }) => {
    return {
      ...state,
      error: null,
      subjects: [...state.subjects, subject],
    };
  }),
  on(Actions.addSubjectError, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),
  on(Actions.updateSubject, (state) => {
    return {
      ...state,
      updating: true,
    };
  }),
  on(Actions.updateSubjectSuccess, (state, { subject }) => {
    return {
      ...state,
      subjects: state.subjects.map((item) => item.id === subject.id ? subject : item),
      updating: false,
    };
  }),
  on(Actions.updateSubjectError, (state, { error }) => {
    return {
      ...state,
      error,
      updating: false,
    };
  }),
  on(Actions.deleteSubject, (state) => {
    return {
      ...state,
      deleting: true,
    };
  }),
  on(Actions.deleteSubjectSuccess, (state, { subject }) => {
    return {
      ...state,
      error: null,
      subjects: state.subjects.filter(({ id }) => id !== subject.id),
      deleting: false,
    };
  }),
  on(Actions.deleteSubjectError, (state, { error }) => {
    return {
      ...state,
      error,
      deleting: false,
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
