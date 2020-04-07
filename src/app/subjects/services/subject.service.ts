import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpService } from '../../common/services';
import { Subject } from '../../common/models/subject';
import { urlProvider } from '../../url';
import { Options } from '../../common/models/utils/http-options';
import { map } from 'rxjs/operators';

const { subjects: subjectUrl } = urlProvider;

@Injectable()
export class SubjectService {
  constructor(
    private http: HttpService<Subject>,
  ) { }

  public fetchSubjects(options: Options = new Options()): Observable<Array<Subject>> {
    return this.http.getDataArray(subjectUrl, options);
  }

  public fetchSubject(options: Options = new Options()): Observable<Subject> {
    return this.http.getData(subjectUrl, options).pipe(
      map((subjects) => subjects[0]),
    );
  }

  public addSubjectServer(subject: Subject): Observable<Subject> {
    return this.http.postData(subjectUrl, subject);
  }

  public updateSubject(subject: Subject): Observable<Subject> {
    // if (subject.id === null) {
    //   return of(subject);
    // }

    const { id } = subject;
    return this.http.putData(`${ subjectUrl }/${ id }`, subject);
  }

  public isChanged(sourceSubject: Subject, subject: Subject): boolean {
    return !Object.keys(subject).every((key) => (
      typeof subject[key] === 'object' ||
      subject[key] === null || subject[key] === sourceSubject[key]
    ));
  }
}
