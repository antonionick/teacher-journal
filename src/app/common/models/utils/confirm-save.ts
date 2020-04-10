export interface IConfirmSave<T> {
  disable: boolean;
  message: string;
  isChanged: (data: T) => boolean;
  addToStorage(data: T): void;
  addToServer(data: T): void;
}
