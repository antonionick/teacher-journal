import { Subject } from '../../common/models/subject';
import { TNullable } from '../../common/models/utils';

export interface ISubjectState {
  subjects: Array<Subject>;
  loading: boolean;
  loaded: boolean;
  loadedOne: boolean;
  updating: boolean;
  deleting: boolean;
  error: TNullable<Error>;
  draftSubject: TNullable<Subject>;
}

export const initialState: ISubjectState = {
  subjects: [],
  loading: false,
  loaded: false,
  loadedOne: false,
  updating: false,
  deleting: false,
  error: null,
  draftSubject: null,
};
