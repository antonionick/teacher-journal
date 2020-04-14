import { IStudentsState } from './students';
import { ISubjectState } from './subjects/subjects.state';
import { IMarksState } from './marks/marks.state';

export interface AppState {
  students: IStudentsState;
  subjects: ISubjectState;
  marks: IMarksState;
}
