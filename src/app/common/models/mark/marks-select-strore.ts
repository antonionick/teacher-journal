import { HttpErrorResponse } from '@angular/common/http';

import { Mark } from './mark';
import { TNullable } from '../utils/tnullable';

export interface IMarksSelectStore {
  marks: Array<Mark>;
  error: TNullable<HttpErrorResponse>;
  loading: boolean;
  loaded: boolean;
}
