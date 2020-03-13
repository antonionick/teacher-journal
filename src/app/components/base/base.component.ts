import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

@Component({
  template: '',
})
export class BaseComponent implements OnInit, OnDestroy {
  protected unsubscribe$: Subject<void>;

  public ngOnInit(): void {
    this.unsubscribe$ = new Subject();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
