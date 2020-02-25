import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormConfig } from '../../../common/entities/FormConfig';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent implements OnInit {
  public config: FormConfig = {
    id: '',
    classes: [],
  };

  public formControl: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.formControl = this._formBuilder.group({
      name: this._formBuilder.control(['', Validators.required]),
      lastName: this._formBuilder.control(['', Validators.required]),
      address: this._formBuilder.control(['']),
      description: this._formBuilder.control(['']),
    });
  }

  public onClick(event: FocusEvent): void {
    console.log(event, 'click');
  }

  public onKeyUp(event: KeyboardEvent): void {
    console.log(event, 'keyUp');
  }
}
