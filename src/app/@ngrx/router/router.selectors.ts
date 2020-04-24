import { createFeatureSelector } from '@ngrx/store';
import { MemoizedSelector } from '@ngrx/store/src/selector';
import { RouterReducerState } from '@ngrx/router-store';

import { IRouterStateUrl } from './router.state';

export const selectRouter: MemoizedSelector<object, RouterReducerState<IRouterStateUrl>> =
  createFeatureSelector<RouterReducerState<IRouterStateUrl>>('router');
