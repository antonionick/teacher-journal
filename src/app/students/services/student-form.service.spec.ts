import { EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { Observable, of } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { StudentFormService } from './student-form.service';
import { Student } from 'src/app/common/models/student';

interface IElements {
  [key: string]: {
    LABEL: string;
    PLACEHOLDER: string;
  };
}

interface IFormData {
  ELEMENTS: IElements;
  BUTTONS: Array<string>;
}

const form: IFormData = {
  ELEMENTS: {
    NAME: {
      LABEL: 'Name',
      PLACEHOLDER: 'Enter name:',
    },
    LASTNAME: {
      LABEL: 'LastName',
      PLACEHOLDER: 'Enter lastName:',
    },
    ADDRESS: {
      LABEL: 'Address',
      PLACEHOLDER: 'Enter address:',
    },
    DESCRIPTION: {
      LABEL: 'Description',
      PLACEHOLDER: 'Enter description:',
    },
  },
  BUTTONS: ['Add', 'Clear'],
};

const translate: TranslateService = {
  onLangChange: new EventEmitter,
  get(key: string): Observable<IFormData> {
    return of(form);
  },
} as TranslateService;

describe('StudentFormService', () => {
  describe('getStudentByForm', () => {
    let service: StudentFormService;
    let formConfig: FormGroup;

    beforeEach(() => {
      service = new StudentFormService(translate);
      formConfig = new FormGroup({
        name: new FormControl('Unknown name'),
        lastName: new FormControl('Unknown lastName'),
      });
    });

    it('should return Student with data which are contained in FormGroup', () => {
      const student: Student = service.getStudentByForm(formConfig);

      expect(student.name).toBe('Unknown name');
      expect(student.lastName).toBe('Unknown lastName');
      expect(student.address).toBe('');
    });

    it('should return empty student if FormGroup does not contain data', () => {
      formConfig = new FormGroup({});

      const student: Student = service.getStudentByForm(formConfig);
      expect(student).toEqual(new Student());
    });
  });

  describe('updateConfigData', () => {
    let service: StudentFormService;

    beforeEach(() => {
      service = new StudentFormService(translate);
    });

    it('should update data to empty string if Student value is false in coerce to boolean', () => {
      const student: Student = {} as Student;
      service.updateConfigData(student);

      service.config.pipe(
        take(1),
        tap((config) => {
          config.elements.forEach((item) => {
            expect(item.value).toBe('');
          });
        }),
      ).subscribe();
    });

    it('should update data to empty string if Student is empty', () => {
      const student: Student = new Student();
      service.updateConfigData(student);

      service.config.pipe(
        take(1),
        tap((config) => {
          config.elements.forEach((item) => {
            expect(item.value).toBe('');
          });
        }),
      ).subscribe();
    });

    it('should update data with match value by Student', () => {
      const student: Student = new Student({
        name: 'Unknown',
        lastName: 'Unknown',
        address: 'some street',
      });
      service.updateConfigData(student);

      service.config.pipe(
        take(1),
        tap((config) => {
          config.elements.forEach((item) => {
            expect(item.value).toBe(student[item.key]);
          });
        }),
      ).subscribe();
    });
  });
});
