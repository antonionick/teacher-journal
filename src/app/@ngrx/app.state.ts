import { IStudentsState } from './students';
import { Subject } from '../common/models/Subject';
import { Mark } from '../common/models/mark';

export interface AppState {
  students: IStudentsState;
  subjects: Array<Subject>;
  marks: Array<Mark>;
}
