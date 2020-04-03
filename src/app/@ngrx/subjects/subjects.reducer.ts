import { Action, createReducer, on } from '@ngrx/store';

import * as Actions from './subjects.actions';
import { Subject } from '../../common/models/subject';
import { ActionReducer } from '@ngrx/store/src/models';

const initialState: Array<Subject> = [];

const _subjectsReducer: ActionReducer<Array<Subject>> = createReducer(
  initialState,
  on(Actions.loadSubjectsSuccess, (state, { subjects }) => {
    return [...state, ...subjects];
  }),
  on(Actions.loadSubjectsError, (state, error) => {
    console.log(error);
    return [...state];
  }),
  on(Actions.addSubject, (state, subject) => {
    return [...state, subject];
  }),
  on(Actions.updateSubject, (state, subject) => {
    return state.map((item) => item.id === subject.id ? subject : item);
  }),
  on(Actions.deleteSubject, (state, subject) => {
    return state.filter((item) => item.id !== subject.id);
  }),
);

export function subjectsReducer(state: Array<Subject> | undefined, action: Action): Array<Subject> {
  return _subjectsReducer(state, action);
}
