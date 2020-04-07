import {
  createSelector,
  createFeatureSelector,
  MemoizedSelector,
  MemoizedSelectorWithProps,
} from '@ngrx/store';
import { IMarksState } from './marks.state';
import { AppState } from '../app.state';
import { IMarksSelectStore } from '../../common/models/mark';

const selectMarksState: MemoizedSelector<AppState, IMarksState> = createFeatureSelector('marks');

export const selectMarksBySubject:
  MemoizedSelectorWithProps<AppState, { id: number }, IMarksSelectStore> = createSelector(
  selectMarksState,
  ({ marks, error, loading }, { id }) => {
    return { error, loading, marks: marks[id] || [] };
  },
);
