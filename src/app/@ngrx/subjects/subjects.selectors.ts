import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
  MemoizedSelectorWithProps,
} from '@ngrx/store';

import { Subject, ISubjectSelectStore } from '../../common/models/subject';
import { AppState } from '../app.state';
import { ISubjectState } from './subjects.state';
import { TNullable } from '../../common/models/utils/tnullable';

const selectState: MemoizedSelector<AppState, ISubjectState> =
  createFeatureSelector<AppState, ISubjectState>('subjects');

export const selectSubjectsArray: MemoizedSelector<AppState, Array<Subject>> = createSelector(
  selectState,
  (state) => state.subjects,
);

export const selectDraftSubject: MemoizedSelector<AppState, Subject> = createSelector(
  selectState,
  (state) => state.draftSubject,
);

export const selectSubjectById: MemoizedSelectorWithProps<AppState, { id: number },
  ISubjectSelectStore> = createSelector(
  selectState,
  (state, props) => {
    const subject: TNullable<Subject> = state.subjects.find(
      ({ id }) => id === props.id,
    ) || null;

    return { subject, err: state.errorSubject, loading: state.loadingSubject };
  },
);
