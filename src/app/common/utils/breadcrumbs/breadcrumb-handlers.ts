import { select, Store } from '@ngrx/store';
import { AppState, IRouterStateUrl } from '../../../@ngrx';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import * as SubjectSelectors from '../../../@ngrx/subjects/subjects.selectors';
import { Breadcrumb, IBreadcrumbHandlerConfig } from '../../models/breadcrumbs';

function subjectTableHandler(
  { url }: IRouterStateUrl,
  store: Store<AppState>,
): Observable<Array<Breadcrumb>> {
  return store.pipe(
    select(SubjectSelectors.selectSubjectByUrl),
    filter(({ subject }) => subject !== null),
    map(({ subject }) => {
      const breadcrumbs: Array<Breadcrumb> = [];

      let isNext: boolean = true;
      let path: string = '';

      url.slice(1).split('/').forEach((item) => {
        if (item === 'table' || !isNext) {
          isNext = false;
          return;
        }

        path += `/${ item }`;
        breadcrumbs.push(new Breadcrumb({ path, name: item }));
      });

      path += `/table/${ subject.id }`;
      breadcrumbs.push(new Breadcrumb({ path, name: subject.name }));

      return breadcrumbs;
    }),
  );
}

export function getSubjectTableHandler(): IBreadcrumbHandlerConfig {
  return {
    path: '/subjects/table',
    handler: subjectTableHandler,
  };
}

export const handlers: Array<IBreadcrumbHandlerConfig> = [
  getSubjectTableHandler(),
];
