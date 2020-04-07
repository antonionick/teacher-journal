import { Mark } from '../../common/models/mark';
import { TNullable } from '../../common/models/utils/tnullable';

interface IMarks {
  [idSubject: string]: Array<Mark>;
}

export interface IMarksState {
  marks: IMarks;
  readonly loading: boolean;
  readonly loaded: boolean;
  readonly error: TNullable<Error | string>;
}

export const initialState: IMarksState = {
  marks: {},
  loading: false,
  loaded: false,
  error: null,
};
