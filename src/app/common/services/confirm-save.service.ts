import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { IConfirmSave } from '../models/useful/confirm-save';

@Injectable()
export class ConfirmSaveService<T> {
  public confirmNavigation(
    component: T,
    config: IConfirmSave<T>,
  ): Observable<boolean> {
    if (config.checkEmpty(component)) {
      return of(true);
    }

    const confirmation: boolean = window.confirm(config.message);
    if (!confirmation) {
      config.removeFromStorage();
      return of(!confirmation);
    }

    if (config.disable) {
      config.addToStorage(component);
      return of(true);
    }

    return config.addToServer(component).pipe(map(() => true));
  }
}
