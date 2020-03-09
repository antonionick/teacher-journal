import { Injectable } from '@angular/core';

import { IFormConfig } from '../../common/models/Form/Form-config';
import { FormElement } from '../../common/models/Form/Form-element';
import { Student } from '../../common/models/Student';

const config: IFormConfig = {
  id: '',
  classes: [],
  elements: [
    new FormElement({
      value: '',
      key: 'name',
      label: 'Name',
      placeholder: 'Enter name:',
      required: true,
      controlType: 'input',
      type: 'text',
    }),
    new FormElement({
      value: '',
      key: 'lastName',
      label: 'LastName',
      placeholder: 'Enter lastName:',
      required: true,
      controlType: 'input',
      type: 'text',
    }),
    new FormElement({
      value: '',
      key: 'address',
      label: 'Address',
      placeholder: 'Enter address:',
      controlType: 'input',
      type: 'text',
    }),
    new FormElement({
      value: '',
      key: 'description',
      label: 'Description',
      placeholder: 'Enter description:',
      controlType: 'textarea',
    }),
  ],
};

@Injectable()
export class StudentFormService {
  public config: IFormConfig;

  constructor() {
    this.config = config;
  }

  public updateFormData(student: Student): void {
    this.config.elements.forEach((item) => {
      item.value = student[item.key] || '';
    });
  }

  public clearData(): void {
    const student: Student = new Student();
    this.updateFormData(student);
  }
}
