import { RouterReducerState, getSelectors } from '@ngrx/router-store';
import { createFeatureSelector } from '@ngrx/store';
import { MemoizedSelector } from '@ngrx/store/src/selector';
import { RouterStateUrl } from './router.state';

export const selectRouter: MemoizedSelector<object, RouterReducerState<RouterStateUrl>> =
  createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');

export const {
  selectCurrentRoute,
  selectQueryParams,
  selectQueryParam,
  selectRouteParams,
  selectRouteParam,
  selectRouteData,
  selectUrl,
} = getSelectors(selectRouter);
