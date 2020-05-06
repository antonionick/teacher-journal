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

function isAppropriatePath(url: string, path: string): boolean {
  if (path.length > url.length) {
    return false;
  }

  for (let i: number = 0; i < path.length; i++) {
    if (url[i] !== path[i]) {
      return false;
    }
  }

  return true;
}

function toTitleCase(str: string): string {
  if (str.trim().length === 0) {
    return  str;
  }

  return str.split(' ').reduce((acc, item) => (
      `${acc} ${item[0].toUpperCase()}${item.slice(1)}`
    ), '').trim();
}

export { filterByIds, isAppropriatePath, toTitleCase };
