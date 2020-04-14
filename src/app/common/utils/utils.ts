interface IdContains {
  id: number | string;
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

export { filterByIds };
