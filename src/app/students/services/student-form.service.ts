import { Injectable } from '@angular/core';

import { IFormConfig } from '../../common/models/form';
import { FormElement } from '../../common/models/Form';
import { Student } from '../../common/models/student';

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
  buttons: [
    {
      value: 'Add',
      type: 'submit',
      disable: true,
    },
    {
      value: 'Clear',
      type: 'button',
      disable: false,
    },
  ],
};

@Injectable()
export class StudentFormService {
  public config: IFormConfig;

  constructor() {
    this.config = config;
  }

  public updateConfigData(student: Student): void {
    this.config.elements.forEach((item) => {
      item.value = student[item.key] || '';
    });
  }

  public clearData(): void {
    const student: Student = new Student();
    this.updateConfigData(student);
  }
}
