import { TNullable } from '../models/tnullable';

function findById<T extends { id: number | string }>(array: Array<T>, id: number): TNullable<T> {
  return (
    array.find((item) => {
      return +item.id === id;
    }) || null
  );
}

export { findById };
