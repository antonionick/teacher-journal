export interface IConfirmSave<T> {
  disable: boolean;
  message: string;
  isChanged: (data: T) => boolean;
  removeFromStorage(): void;
  addToStorage(data: T): void;
  addToServer(data: T): void;
}
