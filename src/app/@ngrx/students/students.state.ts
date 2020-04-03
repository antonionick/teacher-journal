import { Student } from '../../common/models/student';
import { TNullable } from '../../common/models/utils/tnullable';

export interface IStudentsState {
  students: Array<Student>;
  draftStudent: TNullable<Student>;
  readonly loading: boolean;
  readonly loaded: boolean;
  readonly error: TNullable<Error | string>;
}

export const initialStudentsState: IStudentsState = {
  students: [],
  draftStudent: null,
  loading: false,
  loaded: false,
  error: null,
};
