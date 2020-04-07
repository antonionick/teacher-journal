import { Subject } from '../../common/models/subject';
import { TNullable } from '../../common/models/utils/tnullable';

export interface ISubjectState {
  subjects: Array<Subject>;
  loadingSubjects: boolean;
  loadedSubjects: boolean;
  errorSubjects: TNullable<Error | string>;
  draftSubject: TNullable<Subject>;
  errorDraftSubject: TNullable<Error | string>;
  loadingSubject: boolean;
  loadedSubject: boolean;
  errorSubject: TNullable<Error | string>;
}

export const initialState: ISubjectState = {
  subjects: [],
  loadingSubjects: false,
  loadedSubjects: false,
  errorSubjects: null,
  draftSubject: null,
  errorDraftSubject: null,
  loadingSubject: false,
  loadedSubject: false,
  errorSubject: null,
};
