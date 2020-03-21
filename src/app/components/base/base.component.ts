import { Component, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

@Component({
  template: '',
})
export class BaseComponent implements OnDestroy {
  protected unsubscribe$: Subject<void>;

  constructor() {
    this.unsubscribe$ = new Subject();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
