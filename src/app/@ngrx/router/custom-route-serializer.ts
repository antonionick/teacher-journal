import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterStateUrl } from './router.state';

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  public serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route: ActivatedRouteSnapshot = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams },
    } = routerState;
    const { params, fragment } = route;

    return { url, params, queryParams, fragment };
  }
}
