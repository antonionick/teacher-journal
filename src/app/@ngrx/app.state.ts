import { IStudentsState } from './students';
import { ISubjectState } from './subjects/subjects.state';
import { Mark } from '../common/models/mark';

export interface AppState {
  students: IStudentsState;
  subjects: ISubjectState;
  marks: Array<Mark>;
}
