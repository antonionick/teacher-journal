import { Params } from '@angular/router';

import { RouterReducerState } from '@ngrx/router-store';

export interface IRouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
  fragment: string;
}

export interface IRouterState {
  router: RouterReducerState<IRouterStateUrl>;
}
