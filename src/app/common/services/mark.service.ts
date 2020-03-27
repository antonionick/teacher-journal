import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpService } from './http.service';
import { Mark } from '../models/mark/mark';
import { urlProvider } from '../../url';
import { Options } from '../models/useful/http-options';

const {
  marks: marksURL,
} = urlProvider;

@Injectable({
  providedIn: 'root',
})
export class MarkService {
  constructor(
    private http: HttpService<Mark>,
  ) { }

  public fetchMarks(options: Options = new Options()): Observable<Array<Mark>> {
    return this.http.getDataArray(marksURL, options);
  }

  public postMark(mark: Mark): Observable<Mark> {
    return this.http.postData(marksURL, mark);
  }

  public putMark(mark: Mark): Observable<Mark> {
    return this.http.putData(`${marksURL}/${mark.id}`, mark);
  }

  public deleteMark(mark: Mark): Observable<Mark> {
    return this.http.deleteData(`${marksURL}/${mark.id}`);
  }
}
