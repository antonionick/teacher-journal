import { Action, ActionReducer, createReducer, on } from '@ngrx/store';

import * as Actions from './marks.actions';
import { Mark } from '../../common/models/mark';

const initialState: Array<Mark> = [];

const _marksReducer: ActionReducer<Array<Mark>> = createReducer(
  initialState,
  on(Actions.loadMarksSuccess, (state, { marks }) => {
    return [...state, ...marks];
  }),
  on(Actions.loadMarksError, (state, error) => {
    console.log('mark error', error);
    return [...state];
  }),
  on(Actions.addMark, (state, mark: Mark) => [...state, mark]),
  on(
    Actions.updateMark,
    (state, mark: Mark) => state.map((item) => item.id === mark.id ? mark : item),
  ),
  on(Actions.deleteMark, (state, mark: Mark) => state.filter((item) => item.id !== mark.id)),
  )
;

export function marksReducer(state: Array<Mark> | undefined, action: Action): Array<Mark> {
  return _marksReducer(state, action);
}
