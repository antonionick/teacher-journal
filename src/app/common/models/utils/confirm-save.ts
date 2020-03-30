import { Observable } from 'rxjs';

export interface IConfirmSave<T> {
  disable: boolean;
  message: string;
  checkEmpty: (data: T) => boolean;
  removeFromStorage(): void;
  addToStorage(data: T): void;
  addToServer(data: T): Observable<T>;
}
