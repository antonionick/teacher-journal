import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpService, LocalStorageService } from '../../common/services/index';
import { Subject } from '../../common/models/Subject';
import { urlProvider } from '../../url';
import { TNullable } from '../../common/models/TNullable';

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

  public fetchSubjectServer(): Observable<Array<Subject>> {
    return this.http.getData(subjectUrl);
  }

  public addSubjectServer(subject: Subject): Observable<Subject> {
    return this.http.postData(subjectUrl, subject);
  }

  public checkEmptySubject(subject: Subject): boolean {
    const emptySubject: Subject = new Subject();

    return Object.keys(subject).every((key) => (
      subject[key] === emptySubject[key]
    ));
  }
}
