function getProperties<T, U>(arr: Array<T>, property: string): Array<U> {
  return arr.map((item) => item[property]);
}

export { getProperties };
