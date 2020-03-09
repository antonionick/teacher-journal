import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { IConfirmSave } from '../models/Confirm-save';

@Injectable()
export class ConfirmSaveService<T> {
  public confirmNavigation(component: T, config: IConfirmSave<T>): Observable<boolean> {
    if (config.checkEmpty(component)) {
      return of(true);
    }

    const { message, disable } = config;
    const confirmation: boolean = window.confirm(message);
    if (!confirmation) {
      config.removeFromStorage();
      return of(!confirmation);
    }

    if (disable) {
      config.addToStorage(component);
      return of(true);
    }

    return config.addToServer(component).pipe(
      map(() => true),
    );
  }
}
