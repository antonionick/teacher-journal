import { TNullable } from '../models/tnullable';

function getProperties<T, U>(arr: Array<T>, property: string): Array<U> {
  return arr.map((item) => item[property]);
}

function findById<T extends { id: number | string }>(array: Array<T>, id: number): TNullable<T> {
  return (
    array.find((item) => {
      return +item.id === id;
    }) || null
  );
}

export { getProperties, findById };
