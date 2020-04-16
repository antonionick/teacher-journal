import { Store } from '@ngrx/store';
import { AppState } from '../../../@ngrx';

import { Observable } from 'rxjs';

import { Breadcrumb } from './breadcrumb-config';
import { IRouterStateUrl } from '../../../@ngrx/router';

export interface IBreadcrumbHandler {
  (state: IRouterStateUrl, store?: Store<AppState>): Observable<Array<Breadcrumb>>;
}
