import { ActionReducerMap } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';

import { IRouterState } from './router.state';

export const routerReducers: ActionReducerMap<IRouterState> = {
  router: routerReducer,
};
