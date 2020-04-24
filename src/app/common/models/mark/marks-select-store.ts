import { HttpErrorResponse } from '@angular/common/http';

import { Mark } from './mark';
import { TNullable } from '../utils';

export interface IMarksSelectStore {
  id: number;
  marks: TNullable<Array<Mark>>;
  error: TNullable<HttpErrorResponse>;
  loading: boolean;
  loaded: boolean;
}
