import { TNullable } from '../models/utils/tnullable';

interface IdContains {
  id: number | string;
}

function findById<T extends IdContains>(array: Array<T>, id: number): TNullable<T> {
  return (
    array.find((item) => {
      return +item.id === id;
    }) || null
  );
}

function filterByIds<T extends IdContains>(array: Array<T>, filterIds: Array<number>): Array<T> {
  const ids: { [key: string]: boolean } = {};
  filterIds.forEach((id) => {
    ids[id] = true;
  });

  return array.filter((item: T) => {
    return ids[item.id];
  });
}

export { findById, filterByIds };
