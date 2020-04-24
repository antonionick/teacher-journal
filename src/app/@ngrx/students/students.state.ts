import { Student } from '../../common/models/student';
import { TNullable } from '../../common/models/utils';

export interface IStudentsState {
  students: Array<Student>;
  draftStudent: TNullable<Student>;
  readonly loading: boolean;
  readonly loaded: boolean;
  readonly error: TNullable<Error>;
}

export const initialStateStudents: IStudentsState = {
  students: [],
  draftStudent: null,
  loading: false,
  loaded: false,
  error: null,
};
