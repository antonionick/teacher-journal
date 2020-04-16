import { HttpErrorResponse } from '@angular/common/http';

import { Mark } from '../../common/models/mark';
import { TNullable } from '../../common/models/utils';

interface IMarks {
  [idSubject: string]: Array<Mark>;
}

export interface IMarksState {
  marks: IMarks;
  readonly loading: boolean;
  readonly loaded: boolean;
  readonly adding: boolean;
  readonly updating: boolean;
  readonly deleting: boolean;
  readonly error: TNullable<HttpErrorResponse>;
}

export const initialStateMarks: IMarksState = {
  marks: {},
  loading: false,
  loaded: false,
  adding: false,
  updating: false,
  deleting: false,
  error: null,
};
