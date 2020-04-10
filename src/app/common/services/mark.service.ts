import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { forkJoin, Observable } from 'rxjs';

import { Mark } from '../models/mark';
import { urlProvider } from '../../url';
import { Options } from '../models/utils/http-options';

const {
  marks: marksURL,
} = urlProvider;

@Injectable({
  providedIn: 'root',
})
export class MarkService {
  constructor(
    private http: HttpClient,
  ) { }

  public fetchMarks(options: Options = new Options()): Observable<Array<Mark>> {
    return this.http.get<Array<Mark>>(marksURL, options);
  }

  public postMark(mark: Mark): Observable<Mark> {
    return this.http.post<Mark>(marksURL, mark);
  }

  public postMarks(marks: Array<Mark>): Observable<Array<Mark>> {
    const requests$: Array<Observable<Mark>> = marks.map((item) => {
      return this.postMark(item);
    });

    return forkJoin(...requests$);
  }

  public putMark(mark: Mark): Observable<Mark> {
    return this.http.put<Mark>(`${ marksURL }/${ mark.id }`, mark);
  }

  public putMarks(marks: Array<Mark>): Observable<Array<Mark>> {
    const requests$: Array<Observable<Mark>> = marks.map((item) => {
      return this.putMark(item);
    });

    return forkJoin(...requests$);
  }

  public deleteMark(mark: Mark): Observable<Mark> {
    return this.http.delete<Mark>(`${ marksURL }/${ mark.id }`);
  }

  public deleteMarks(marks: Array<Mark>): Observable<Array<Mark>> {
    const requests$: Array<Observable<Mark>> = marks.map((item) => {
      return this.deleteMark(item);
    });

    return forkJoin(...requests$);
  }
}
