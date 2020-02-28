import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormConfig } from '../../../common/models/Form/Form-config';
import { FormElement } from '../../../common/models/Form/Form-element';
import { Student } from '../../../common/models/Student';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent implements OnInit {
  @Output('submit')
  public submit: EventEmitter<Student> = new EventEmitter();

  public config: FormConfig;

  public ngOnInit(): void {
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

  public onSubmit(form: FormGroup): void {
    const result: Student = { id: null, ...form.value };
    form.reset();
    this.submit.emit(result);
  }
}
