import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';

import { select, Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import * as RouterSelectors from '../../@ngrx/router/router.selectors';
import { AppState, IRouterStateUrl } from '../../@ngrx';
import { Breadcrumb, IBreadcrumbHandler } from '../../common/models/breadcrumbs';
import { TNullable } from '../../common/models/utils';
import { BreadcrumbChooseHandler, handlers } from '../../common/utils/breadcrumbs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent implements OnInit {
  private chooseHandler: BreadcrumbChooseHandler;

  public icon: IconDefinition;
  public config: TNullable<Array<Breadcrumb>>;

  constructor(private store: Store<AppState>, private cdr: ChangeDetectorRef) {
    this.chooseHandler = new BreadcrumbChooseHandler(handlers);
    this.icon = faArrowRight;
    this.config = null;
  }

  private defaultHandler({ url }: IRouterStateUrl): Observable<Array<Breadcrumb>> {
    const breadcrumbs: Array<Breadcrumb> = [];
    let path: string = '';

    // from 1 because first symbol is '/'
    url.slice(1).split('/').forEach((item) => {
      path += `/${item}`;
      breadcrumbs.push(new Breadcrumb({ path, name: item }));
    });

    return of(breadcrumbs);
  }

  public ngOnInit(): void {
    this.store.pipe(
      select(RouterSelectors.selectRouter),
      filter((_, index) => index > 0),
      switchMap(({ state }) => {
        const handler: TNullable<IBreadcrumbHandler> = this.chooseHandler.process(state);
        return handler === null ? this.defaultHandler(state) : handler(state, this.store);
      }),
    ).subscribe({
      next: (config) => {
        this.config = config;
        this.cdr.markForCheck();
      },
    });
  }
}
