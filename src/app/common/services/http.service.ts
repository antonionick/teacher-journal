import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Options } from '../models/utils/http-options';

@Injectable({
  providedIn: 'root',
})
export class HttpService<T> {
  constructor(private http: HttpClient) { }

  public getDataArray(
    url: string,
    options: Options = {} as Options,
  ): Observable<Array<T>> {
    return this.http.get<Array<T>>(url, options);
  }

  public getData(
    url: string,
    options: Options = {} as Options,
  ): Observable<T> {
    return this.http.get<T>(url, options);
  }

  public postData(url: string, data: T): Observable<T> {
    return this.http.post<T>(url, data);
  }

  public putData(url: string, data: T): Observable<T> {
    return this.http.put<T>(url, data);
  }

  public deleteData(url: string, options: Options = {} as Options): Observable<T> {
    return this.http.delete<T>(url, options);
  }
}
