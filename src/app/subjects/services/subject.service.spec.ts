import { HttpClient } from '@angular/common/http';
import { async, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SubjectService } from './subject.service';
import { Subject } from '../../common/models/subject';
import { urlProvider } from '../../url';
import * as HttpUtils from  '../../common/utils/http';
import { Options } from '../../common/models/utils';

const { subjects: url } = urlProvider;

describe('SubjectService', () => {
  describe('isChanged', () => {
    const service: SubjectService = new SubjectService({} as HttpClient);
    let sourceSubject: Subject;
    let subject: Subject;

    beforeEach(() => {
      sourceSubject = new Subject({
        name: 'Unknown1',
        teacher: 'Teacher1',
      });

      subject = new Subject({
        name: 'Unknown2',
        teacher: 'Teacher2',
      });
    });

    it('should return false if passed subjects the same', () => {
      subject.name = sourceSubject.name;
      subject.teacher = sourceSubject.teacher;
      const isChanged: boolean = service.isChanged(sourceSubject, subject);
      expect(isChanged).toBe(false);
    });

    it('should return true if passed subjects are different', () => {
      const isChanged: boolean = service.isChanged(sourceSubject, subject);
      expect(isChanged).toBe(true);
    });

    it('should compare by properties, not by reference', () => {
      subject.name = sourceSubject.name = '1';
      subject.teacher = sourceSubject.teacher = '1';
      const isChanged: boolean = service.isChanged(sourceSubject, subject);
      expect(isChanged).toBe(false);
    });
  });

  describe('Subject http', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [SubjectService],
      }).compileComponents();
    }));

    it('should get one subject from server', inject(
      [SubjectService, HttpTestingController],
      (service: SubjectService, backend: HttpTestingController) => {
        const subject: Subject = new Subject();
        const httpOptions: Options = HttpUtils.getParamsWithId(1);

        service.fetchSubject(httpOptions).subscribe((res) => {
          expect(res).toEqual(subject);
        });

        backend.expectOne({
          method: 'GET',
          url: `${url}?id=1`,
        }).flush([subject]);
      },
    ));

    it('should get subjects from server', inject(
      [SubjectService, HttpTestingController],
      (service: SubjectService, backend: HttpTestingController) => {
        const subjects: Array<Subject> = [new Subject()];

        service.fetchSubjects().subscribe((res) => {
          expect(res).toEqual(subjects);
        });

        backend.expectOne({
          method: 'GET',
          url,
        }).flush(subjects);
      },
    ));

    it('should add subject to server', inject(
      [SubjectService, HttpTestingController],
      (service: SubjectService, backend: HttpTestingController) => {
        const subject: Subject = new Subject();

        service.addSubjectServer(subject).subscribe((res) => {
          expect(res).toEqual(subject);
        });

        backend.expectOne({
          method: 'POST',
          url,
        }).flush(subject);
      },
    ));

    it('should update subject in server', inject(
      [SubjectService, HttpTestingController],
      (service: SubjectService, backend: HttpTestingController) => {
        const subject: Subject = new Subject({ id: 1 });

        service.updateSubject(subject).subscribe((res) => {
          expect(res).toEqual(subject);
        });

        backend.expectOne({
          method: 'PUT',
          url: `${url}/1`,
        }).flush(subject);
      },
    ));

    it('should delete subject in server', inject(
      [SubjectService, HttpTestingController],
      (service: SubjectService, backend: HttpTestingController) => {
        const subject: Subject = new Subject({ id: 1 });

        service.deleteSubject(subject).subscribe((res) => {
          expect(res).toEqual({} as Subject);
        });

        backend.expectOne({
          method: 'DELETE',
          url: `${url}/1`,
        }).flush({});
      },
    ));
  });
});
