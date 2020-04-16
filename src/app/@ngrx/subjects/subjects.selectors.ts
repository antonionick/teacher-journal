import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
  MemoizedSelectorWithProps,
} from '@ngrx/store';

import { AppState } from '../app.state';
import { ISubjectState } from './subjects.state';
import { selectRouter } from '../router';
import { Subject, ISubjectSelectStore } from '../../common/models/subject';
import { TNullable } from '../../common/models/utils';

const selectState: MemoizedSelector<AppState, ISubjectState> =
  createFeatureSelector<AppState, ISubjectState>('subjects');

export const selectDraftSubject: MemoizedSelector<AppState, Subject> = createSelector(
  selectState,
  (state) => state.draftSubject,
);

export const selectSubjectById: MemoizedSelectorWithProps<AppState, { id: number },
  ISubjectSelectStore> = createSelector(
  selectState,
  ({ subjects, error, loading }, props) => {
    const subject: TNullable<Subject> = subjects.find(
      ({ id }) => id === props.id,
    ) || null;

    return { id: props.id, subject, loading, err: error };
  },
);

export const selectSubjectByUrl: MemoizedSelector<AppState, ISubjectSelectStore> = createSelector(
  selectState,
  selectRouter,
  ({ subjects, error, loading }, router) => {
    const routerId: number = +router.state.params.id;
    const subject: TNullable<Subject> = subjects.find(({ id }) => {
      return id === routerId;
    }) || null;

    return { id: routerId, subject, loading, err: error };
  },
);
