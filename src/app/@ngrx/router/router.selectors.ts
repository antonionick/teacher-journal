import { createFeatureSelector } from '@ngrx/store';
import { MemoizedSelector } from '@ngrx/store/src/selector';
import { RouterReducerState } from '@ngrx/router-store';

import { RouterStateUrl } from './router.state';

export const selectRouter: MemoizedSelector<object, RouterReducerState<RouterStateUrl>> =
  createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');
