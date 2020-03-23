import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Options } from '../models/useful/http-options';

@Injectable({
  providedIn: 'root',
})
export class HttpService<T> {
  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error(`An error occurred: ${error.error.message}`);
    } else {
      console.error(`Error status: ${error.status}\n Error body: ${error.message}`);
    }
    return throwError('Something bad happened; please try again later.');
  }

  public getDataArray(
    url: string,
    options: Options = new Options(),
    retryCount: number = 3,
  ): Observable<Array<T>> {
    return this.http.get<Array<T>>(url, options).pipe(
      retry(retryCount),
      // catchError(this.handleError),
    );
  }

  public getData(
    url: string,
    options: Options = new Options(),
    retryCount: number = 3,
  ): Observable<T> {
    return this.http.get<T>(url, options).pipe(
      retry(retryCount),
      // catchError(this.handleError),
    );
  }

  public postData(url: string, data: T): Observable<T> {
    return this.http.post<T>(url, data).pipe(
      catchError(this.handleError),
    );
  }

  public putData(url: string, data: T): Observable<T> {
    return this.http.put<T>(url, data).pipe(
      catchError(this.handleError),
    );
  }
}
