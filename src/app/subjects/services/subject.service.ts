import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpService } from '../../common/services/http.service';
import { ISubject } from '../../common/models/Subject';
import { urlProvider } from '../../url';

const { subjects: subjectUrl } = urlProvider;

@Injectable()
export class SubjectService {

  constructor(
    private http: HttpService<ISubject>,
  ) { }

  public fetchSubjectsServer(): Observable<Array<ISubject>> {
    return this.http.getData(subjectUrl);
  }

  public addSubjectsServer(subject: ISubject): Observable<ISubject> {
    return this.http.postData(subjectUrl, subject);
  }
}
