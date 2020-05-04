import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IFormConfig, FormElement } from '../../common/models/form';
import { Subject } from 'src/app/common/models/subject/subject';
import { TNullable } from 'src/app/common/models/utils';

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
  buttons: [
    {
      value: 'Add',
      type: 'submit',
      disable: true,
    },
    {
      value: 'clear',
      type: 'button',
      disable: false,
    },
  ],
};

@Injectable()
export class SubjectFormService {
  private readonly formConfig: IFormConfig;

  public get config(): IFormConfig {
    return this.formConfig;
  }

  constructor() {
    this.formConfig = formConfig;
  }

  public getSubjectByForm(form: FormGroup): Subject {
    const subject: Subject = new Subject();

    Object.keys(form.value).forEach((key) => {
      subject[key] = form.value[key] || subject[key];
    });

    return subject;
  }

  public updateFormData(subject: TNullable<Subject>): void {
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
}
