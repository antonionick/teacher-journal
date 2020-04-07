import { Subject } from './subject';
import { TNullable } from '../utils/tnullable';

export interface ISubjectSelectStore {
  subject: TNullable<Subject>;
  err: TNullable<string | Error>;
  loading: boolean;
}
