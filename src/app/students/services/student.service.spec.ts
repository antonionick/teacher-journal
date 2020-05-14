import { HttpClient } from '@angular/common/http';

import { StudentService } from './student.service';
import { Student } from 'src/app/common/models/student';

describe('StudentService', () => {
  describe('isChanges', () => {
    let service: StudentService;
    let sourceStudent: Student;
    let student: Student;

    beforeEach(() => {
      service = new StudentService({} as HttpClient);
      sourceStudent = new Student();
      student = new Student();
    });

    it('should return false if source and current students the same', () => {
      const isChanged: boolean = service.isChanged(sourceStudent, student);
      expect(false).toBe(isChanged);
    });

    it('should return false if source and current students the same except id, ' +
      'current student id is null', () => {
        // when student creates id is null by default
        // this is why student don't creates
        sourceStudent = new Student({ id: 505 });

        const isChanged: boolean = service.isChanged(sourceStudent, student);
        expect(false).toBe(isChanged);
      });

    it('should return true if source and current students different', () => {
      sourceStudent = new Student({ name: 'Unknown' });
      student = new Student({ name: 'SosOSsoSO' });

      const isChanged: boolean = service.isChanged(sourceStudent, student);
      expect(true).toBe(isChanged);
    });
  });
});
