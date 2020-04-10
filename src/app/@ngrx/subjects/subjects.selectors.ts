import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
  MemoizedSelectorWithProps,
} from '@ngrx/store';
import { AppState } from '../app.state';
import { ISubjectState } from './subjects.state';

import { Subject, ISubjectSelectStore } from '../../common/models/subject';
import { TNullable } from '../../common/models/utils/tnullable';

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

    return { subject, loading, err: error };
  },
);
