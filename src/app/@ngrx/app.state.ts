import { IStudentsState } from './students';
import { ISubjectState } from './subjects';
import { IMarksState } from './marks';
import { IRouterState } from './router';

export interface AppState {
  students: IStudentsState;
  subjects: ISubjectState;
  marks: IMarksState;
  router: IRouterState;
}
