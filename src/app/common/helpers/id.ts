function getProperties<T>(arr: Array<T>, property: string): Array<number> {
  return arr.map((item) => item[property]);
}

function getMaxId(array: { id: number }[]): number {
  const ids: Array<number> = getProperties(array, 'id');
  return Math.max(...ids);
}

export { getMaxId };
