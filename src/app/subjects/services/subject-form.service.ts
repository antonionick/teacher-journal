import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { SubjectService } from './subject.service';
import { IFormConfig, FormElement } from '../../common/models/Form/index';
import { Subject } from 'src/app/common/models/Subject';

const formConfig: IFormConfig = {
  id: '',
  classes: [],
  elements: [
    new FormElement({
      value: '',
      key: 'name',
      label: 'Name',
      placeholder: 'Enter subject:',
      required: true,
      controlType: 'input',
      type: 'text',
    }),
    new FormElement({
      value: '',
      key: 'teacher',
      label: 'Teacher',
      placeholder: 'Enter teacher:',
      required: true,
      controlType: 'input',
      type: 'text',
    }),
    new FormElement({
      value: '',
      key: 'cabinet',
      label: 'Cabinet',
      placeholder: 'Enter cabinet:',
      required: false,
      controlType: 'input',
      type: 'text',
    }),
    new FormElement({
      value: '',
      key: 'description',
      label: 'Description',
      placeholder: 'Enter description:',
      required: false,
      controlType: 'textarea',
    }),
  ],
};

@Injectable()
export class SubjectFormService {
  private formConfig: IFormConfig;
  public get config(): IFormConfig {
    return this.formConfig;
  }

  constructor(
    private subjectService: SubjectService,
  ) {
    this.formConfig = formConfig;
    this.clearFormData();

    const subject: Subject = this.subjectService.getSubjectStorage();
    this.updateFormData(subject);
  }

  public updateFormData(subject: Subject): void {
    if (subject === null) {
      return;
    }

    const emptySubject: Subject = new Subject();
    this.formConfig.elements.forEach((item) => {
      item.value = subject[item.key] || emptySubject[item.key];
    });
  }

  public clearFormData(): void {
    this.updateFormData({} as Subject);
  }

  public getSubjectOfForm(data: FormGroup): Subject {
    return { id: null, ...data.value };
  }
}
