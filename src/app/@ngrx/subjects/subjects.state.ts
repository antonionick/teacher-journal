import { Subject } from '../../common/models/subject';
import { TNullable } from '../../common/models/utils/tnullable';

export interface ISubjectState {
  subjects: Array<Subject>;
  loading: boolean;
  loaded: boolean;
  error: TNullable<Error | string>;
  draftSubject: TNullable<Subject>;
}

export const initialState: ISubjectState = {
  subjects: [],
  loading: false,
  loaded: false,
  error: null,
  draftSubject: null,
};
