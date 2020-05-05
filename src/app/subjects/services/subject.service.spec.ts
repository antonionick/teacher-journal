import { HttpClient } from '@angular/common/http';

import { SubjectService } from './subject.service';
import { Subject } from '../../common/models/subject';

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
});
