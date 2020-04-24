import { Options } from '../models/utils';
import { HttpParams } from '@angular/common/http';

export function updateParamsExcludes<T>(options: Options, key: string, values: Array<T>): void {
  values.forEach((value) => {
    options.params = options.params.append(`${ key }_ne`, `${ value }`);
  });
}

export function getParamsExcludes<T>(key: string, values: Array<T>): Options {
  const options: Options = new Options();
  updateParamsExcludes<T>(options, key, values);
  return options;
}

export function getParamsExcludesById<T extends { id: number }>(
  values: Array<T>,
): Options {
  return getParamsExcludes<number>('id', values.map((value) => value.id));
}

export function getParamsWithId(id: number): Options {
  return new Options({
    params: new HttpParams({ fromString: `id=${ id }` }),
  });
}

export function updateParams<T>(options: Options, key: string, values: Array<T>): void {
  values.forEach((value) => {
    options.params = options.params.append(key, `${ value }`);
  });
}

export function getParamsWithKey<T>(key: string, values: Array<T>): Options {
  const options: Options = new Options();
  updateParams<T>(options, key, values);
  return options;
}
