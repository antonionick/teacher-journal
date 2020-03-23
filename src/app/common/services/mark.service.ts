import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
}
