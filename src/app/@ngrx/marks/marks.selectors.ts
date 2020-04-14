import {
  createSelector,
  createFeatureSelector,
  MemoizedSelector,
  MemoizedSelectorWithProps,
} from '@ngrx/store';

import { IMarksState } from './marks.state';
import { AppState } from '../app.state';
import { IMarksSelectStore } from '../../common/models/mark';
import { selectRouter } from '../router';

export const selectMarksState: MemoizedSelector<AppState, IMarksState> =
  createFeatureSelector('marks');

export const selectMarksBySubject:
  MemoizedSelectorWithProps<AppState, { id: number }, IMarksSelectStore> = createSelector(
    selectMarksState,
    ({ marks, error, loading, loaded }, { id }) => {
      return { id, error, loading, loaded, marks: marks[id] || null };
    },
  );

export const selectMarksByUrl: MemoizedSelector<AppState, IMarksSelectStore> = createSelector(
  selectMarksState,
  selectRouter,
  ({ marks, error, loading, loaded }, router) => {
    const id: number = +router.state.params.id;
    return { id, error, loading, loaded, marks: marks[id] || null };
  },
);
