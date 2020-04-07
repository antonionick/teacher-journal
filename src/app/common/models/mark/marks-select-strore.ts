import { Mark } from './mark';
import { TNullable } from '../utils/tnullable';

export interface IMarksSelectStore {
  marks: Array<Mark>;
  error: TNullable<string | Error>;
  loading: boolean;
}
