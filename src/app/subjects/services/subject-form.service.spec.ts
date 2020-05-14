import { EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { Observable, of } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';

import { SubjectFormService } from './';
import { Subject } from '../../common/models/subject';
import { IFormConfig } from 'src/app/common/models/form';

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
    TEACHER: {
      LABEL: 'Teacher',
      PLACEHOLDER: 'Enter teacher:',
    },
    CABINET: {
      LABEL: 'Cabinet',
      PLACEHOLDER: 'Enter cabinet:',
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

describe('SubjectFormService', () => {
  describe('getSubjectByForm', () => {
    let service: SubjectFormService;
    let subject: Subject;
    let formConfig: FormGroup;

    beforeEach(() => {
      service = new SubjectFormService(translate);
      subject = new Subject();
      formConfig = new FormGroup({
        name: new FormControl('Subject'),
        teacher: new FormControl('Teacher'),
      });
    });

    it('should return empty subject if FormGroup does not contain data', () => {
      formConfig = new FormGroup({});
      subject = service.getSubjectByForm(formConfig);

      expect(subject).toEqual(new Subject());
    });

    it('should return Subject with data which are contained in FormGroup', () => {
      subject = service.getSubjectByForm(formConfig);

      expect(subject.name).toBe('Subject');
      expect(subject.teacher).toBe('Teacher');
      expect(subject.cabinet).toBe('');
    });
  });

  describe('updateFormData', () => {
    let service: SubjectFormService;
    let subject: Subject;

    beforeEach(() => {
      service = new SubjectFormService(translate);
      subject = new Subject({
        name: 'Subject',
        teacher: 'Teacher',
        cabinet: '1221',
      });
    });

    it('should not update if Subject is null', () => {
      const valuesBeforeUpdate: { [key: string]: string } = {};

      const fillValues: (config: IFormConfig) => void =
        (config) => config.elements.forEach((item) => {
          valuesBeforeUpdate[item.key] = item.value;
        });

      const checkValues: (config: IFormConfig) => void =
        (config) => config.elements.forEach((item) => {
          expect(item.value).toBe(valuesBeforeUpdate[item.key]);
        });

      service.config.pipe(
        take(1),
        tap(fillValues),
        tap(() => service.updateFormData(null)),
        mergeMap(() => service.config),
        take(1),
        tap(checkValues),
      ).subscribe();
    });

    it('should update data by Subject', () => {
      service.updateFormData(subject);

      service.config.pipe(
        take(1),
        tap((config) => {
          config.elements.forEach((item) => {
            expect(item.value).toBe(subject[item.key]);
          });
        }),
      ).subscribe();
    });

    it('should take default data for Subject ' +
      'if passed Subject value in coerce to boolean is false', () => {
      subject.name = null;

      service.updateFormData(subject);

      service.config.pipe(
        map((config) => (
          config.elements.find((item) => item.key === 'name')
        )),
        tap((nameField) => expect(nameField.value).toBe('')),
      ).subscribe();
    });
  });
});
