import { Injectable } from '@angular/core';

import { FormConfig } from '../../../common/models/Form/Form-config';
import { FormElement } from '../../../common/models/Form/Form-element';
import { Student } from '../../../common/models/Student';

@Injectable()
export class StudentFormService {
  public config: FormConfig;

  constructor() {
    this.config = {
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
  }

  public changeConfig(student: Student): void {
    this.config.elements.forEach((item) => {
      if (student[item.key]) {
        item.value = student[item.key];
      }
    });
  }

  public clearData(): void {
    const student: Student = new Student();

    this.config.elements.forEach((item) => {
      if (student[item.key] !== undefined) {
        item.value = student[item.key];
      }
    });
  }
}
