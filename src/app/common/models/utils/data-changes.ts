export interface IDataChanges<T> {
  created: Array<T>;
  updated: Array<T>;
  deleted: Array<T>;
}
