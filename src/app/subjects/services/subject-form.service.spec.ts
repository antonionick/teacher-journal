import { FormGroup, FormControl } from '@angular/forms';

import { SubjectFormService } from './';
import { Subject } from '../../common/models/subject';
import { FormElement } from 'src/app/common/models/form';

describe('SubjectFormService', () => {
  describe('getSubjectByForm', () => {
    let service: SubjectFormService;
    let subject: Subject;
    let formConfig: FormGroup;

    beforeEach(() => {
      service = new SubjectFormService();
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
      service = new SubjectFormService();
      subject = new Subject({
        name: 'Subject',
        teacher: 'Teacher',
        cabinet: '1221',
      });
    });

    it('should not update if Subject is null', () => {
      const valuesBeforeUpdate: { [key: string]: string } =
        service.config.elements.reduce((result, item) => {
          result[item.key] = item.value;
          return result;
        }, {});

      service.updateFormData(null);

      service.config.elements.forEach((item) => {
        expect(item.value).toBe(valuesBeforeUpdate[item.key]);
      });
    });

    it('should update data by Subject', () => {
      service.updateFormData(subject);

      service.config.elements.forEach((item) => {
        expect(item.value).toBe(subject[item.key]);
      });
    });

    it('should take default data for Subject ' +
      'if passed Subject value in coerce to boolean is false', () => {
        subject.name = null;

        service.updateFormData(subject);

        const nameField: FormElement<string> = service.config.elements.find((item) => (
          item.key === 'name'
        ));
        expect(nameField.value).toBe('');
      });
  });
});
