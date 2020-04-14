import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Subject } from '../../common/models/subject';
import { urlProvider } from '../../url';
import { Options } from '../../common/models/utils/http-options';
import { map } from 'rxjs/operators';

const { subjects: subjectUrl } = urlProvider;

@Injectable()
export class SubjectService {
  constructor(
    private http: HttpClient,
  ) { }

  public fetchSubjects(options: Options = new Options()): Observable<Array<Subject>> {
    return this.http.get<Array<Subject>>(subjectUrl, options);
  }

  public fetchSubject(options: Options = new Options()): Observable<Subject> {
    return this.http.get<Subject>(subjectUrl, options).pipe(
      map((subjects) => subjects[0]),
    );
  }

  public addSubjectServer(subject: Subject): Observable<Subject> {
    return this.http.post<Subject>(subjectUrl, subject);
  }

  public updateSubject(subject: Subject): Observable<Subject> {
    // if (subject.id === null) {
    //   return of(subject);
    // }

    const { id } = subject;
    return this.http.put<Subject>(`${ subjectUrl }/${ id }`, subject);
  }

  public isChanged(sourceSubject: Subject, subject: Subject): boolean {
    return !Object.keys(subject).every((key) => (
      typeof subject[key] === 'object' ||
      subject[key] === null || subject[key] === sourceSubject[key]
    ));
  }
}
