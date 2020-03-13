import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpService } from './http.service';
import { Mark } from '../models/Mark';
import { urlProvider } from '../../url';

const {
  marks: marksURL,
} = urlProvider;

Injectable({
  providedIn: 'root',
});
export class MarkService {
  constructor(
    private http: HttpService<Mark>,
  ) { }

  public fetchMarks(): Observable<Array<Mark>> {
    return this.http.getData(marksURL);
  }

  public fetchMarksBySubject(subjectID: number): Observable<Array<Mark>> {
    return this.fetchMarks().pipe(
      map((marks: Array<Mark>) => {
        return marks.filter((mark: Mark) => mark.subjectId === subjectID);
      }),
    );
  }
}
