import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store, select } from '@ngrx/store';

import { forkJoin, Observable } from 'rxjs';
import { map, tap, filter, take, switchMap } from 'rxjs/operators';

import * as MarksActions from '../../@ngrx/marks/marks.actions';
import { Mark } from '../models/mark';
import { urlProvider } from '../../url';
import { Options } from '../models/utils';
import { IMarksState, ISubjectState, AppState } from 'src/app/@ngrx';

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
    return this.http.put<Mark>(`${marksURL}/${mark.id}`, mark);
  }

  public putMarks(marks: Array<Mark>): Observable<Array<Mark>> {
    const requests$: Array<Observable<Mark>> = marks.map((item) => {
      return this.putMark(item);
    });

    return forkJoin(...requests$);
  }

  public deleteMark(mark: Mark): Observable<Mark> {
    return this.http.delete<Mark>(`${marksURL}/${mark.id}`);
  }

  public deleteMarks(marks: Array<Mark>): Observable<Array<Mark>> {
    const requests$: Array<Observable<Mark>> = marks.map((item) => {
      return this.deleteMark(item);
    });

    return forkJoin(...requests$);
  }

  public updateMarksStateAfterDelete(store: Store<AppState>): Observable<IMarksState> {
    return store.pipe(
      select('marks'),
      take(1),
      map(({ marks }) => Object.keys(marks).map((id) => +id)),
      tap((ids) => {
        if (ids.length === 0) {
          return;
        }

        store.dispatch(MarksActions.loadMarksBySubjects({ ids }));
      }),
      switchMap((ids) => {
        if (ids.length === 0) {
          return store.pipe(select('marks'));
        }

        return store.pipe(
          select('marks'),
          filter(({ loading }, index) => !loading && index > 0),
        );
      }),
      take(1),
    );
  }

  public isAllMarksLoaded(
    { marks }: IMarksState,
    { subjects, loaded }: ISubjectState,
  ): boolean {
    if (!loaded) {
      return false;
    }

    return subjects.every(({ id }) => Array.isArray(marks[id]));
  }

  public getMarksByKey<T>(key: string, value: T, { marks }: IMarksState): Array<Mark> {
    const keys: Array<string> = Object.keys(marks);

    return keys.reduce((arr, subjectId) => {
      const valueMarks: Array<Mark> = marks[subjectId].filter((mark) => mark[key] === value);
      return [...arr, ...valueMarks];
    }, []);
  }
}
