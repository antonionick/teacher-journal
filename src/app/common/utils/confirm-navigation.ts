import { Observable, of } from 'rxjs';

import { IConfirmSave } from '../models/utils/confirm-save';

export function confirmNavigation<T>(
  component: T,
  config: IConfirmSave<T>,
): Observable<boolean> {
  if (!config.isChanged(component)) {
    return of(true);
  }

  const confirmation: boolean = window.confirm(config.message);
  if (!confirmation) {
    return of(true);
  }

  if (config.disable) {
    config.addToStorage(component);
  } else {
    config.addToServer(component);
  }

  return of(true);
}
