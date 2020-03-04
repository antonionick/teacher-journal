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

  private _changeValue(key: string, value: string): void {
    this.config.elements.forEach((item) => {
      if (item.key !== key) {
        return;
      }

      item.value = value;
    });
  }

  public changeConfig(student: Student): void {
    Object.keys(student).forEach((key) => {
      if (key === '' || key === null) {
        return;
      }

      this._changeValue(key, student[key]);
    });
  }

  public clearData(): void {
    this.config.elements.forEach((item) => {
      if (item.key === 'id') {
        item.key = null;
      }

      item.value = '';
    });
  }
}
