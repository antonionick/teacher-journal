import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Subject } from '../../common/models/subject';
import { urlProvider } from '../../url';
import { Options } from '../../common/models/utils';

const { subjects: subjectUrl } = urlProvider;

@Injectable()
export class SubjectService {
  constructor(
    private http: HttpClient,
  ) { }

  public fetchSubject(options: Options = new Options()): Observable<Subject> {
    return this.http.get<Subject>(subjectUrl, options).pipe(
      map((response) => response[0]),
    );
  }

  public fetchSubjects(options: Options = new Options()): Observable<Array<Subject>> {
    return this.http.get<Array<Subject>>(subjectUrl, options);
  }

  public addSubjectServer(subject: Subject): Observable<Subject> {
    return this.http.post<Subject>(subjectUrl, subject);
  }

  public updateSubject(subject: Subject): Observable<Subject> {
    const { id } = subject;
    return this.http.put<Subject>(`${subjectUrl}/${id}`, subject);
  }

  public deleteSubject({ id }: Subject): Observable<Subject> {
    return this.http.delete<Subject>(`${subjectUrl}/${id}`);
  }

  public isChanged(sourceSubject: Subject, subject: Subject): boolean {
    return !Object.keys(subject).every((key) => (
      typeof subject[key] === 'object' ||
      subject[key] === null || subject[key] === sourceSubject[key]
    ));
  }
}
