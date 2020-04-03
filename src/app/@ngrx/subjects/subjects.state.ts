import { Subject } from '../../common/models/subject';
import { TNullable } from '../../common/models/utils/tnullable';

export interface ISubjectState {
  subjects: Array<Subject>;
  draftSubject: TNullable<Subject>;
  loading: boolean;
  loaded: boolean;
  error: TNullable<Error | string>;
}

export const initialState: ISubjectState = {
  subjects: [],
  draftSubject: null,
  loading: false,
  loaded: false,
  error: null,
};
