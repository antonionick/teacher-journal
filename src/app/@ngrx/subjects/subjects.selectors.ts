import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MemoizedSelector } from '@ngrx/store/src/selector';

import { Subject } from '../../common/models/subject';
import { AppState } from '../app.state';
import { ISubjectState } from './subjects.state';

const selectState: MemoizedSelector<AppState, ISubjectState> =
  createFeatureSelector<AppState, ISubjectState>('subjects');

export const selectDraftSubject: MemoizedSelector<AppState, Subject> = createSelector(
  selectState,
  (state) => state.draftSubject,
);
