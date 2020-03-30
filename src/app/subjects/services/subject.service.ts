import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { HttpService, LocalStorageService } from '../../common/services';
import { Subject } from '../../common/models/subject';
import { urlProvider } from '../../url';
import { TNullable } from '../../common/models/utils/tnullable';
import { Options } from '../../common/models/utils/http-options';

const { subjects: subjectUrl } = urlProvider;

@Injectable()
export class SubjectService {
  constructor(
    private http: HttpService<Subject>,
    private localStorage: LocalStorageService,
  ) { }

  public addSubjectStorage(subject: Subject): void {
    const data: string = JSON.stringify(subject);
    this.localStorage.addItem('subject', data);
  }

  public getSubjectStorage(): TNullable<Subject> {
    const data: string = this.localStorage.getItem('subject');
    return JSON.parse(data);
  }

  public removeSubjectStorage(): void {
    this.localStorage.removeItem('subject');
  }

  public fetchSubjectsServer(options: Options = new Options()): Observable<Array<Subject>> {
    return this.http.getDataArray(subjectUrl, options);
  }

  public fetchSubjectServer(options: Options = new Options()): Observable<Subject> {
    return this.http.getData(subjectUrl, options);
  }

  public addSubjectServer(subject: Subject): Observable<Subject> {
    return this.http.postData(subjectUrl, subject);
  }

  public updateSubject(subject: Subject): Observable<Subject> {
    if (!subject.id) {
      return of(subject);
    }

    const id: number = subject.id;
    return this.http.putData(`${subjectUrl}/${id}`, subject);
  }

  public checkEmptySubject(subject: Subject): boolean {
    const emptySubject: Subject = new Subject();

    return Object.keys(subject).every((key) => (
      subject[key] === emptySubject[key] || subject[key] === null
    ));
  }
}
