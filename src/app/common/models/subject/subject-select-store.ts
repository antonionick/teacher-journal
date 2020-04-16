import { Subject } from './subject';
import { TNullable } from '../utils';

export interface ISubjectSelectStore {
  id: number;
  subject: TNullable<Subject>;
  err: TNullable<Error>;
  loading: boolean;
}
