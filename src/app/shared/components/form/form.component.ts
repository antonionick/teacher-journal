import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FormConfig } from '../../../common/models/Form/Form-config';
import { ButtonConfig } from '../../../common/models/Button-config';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  private _config: FormConfig;

  @Input()
  public set config(config: FormConfig) {
    this._config = config;
  }
  public get config(): FormConfig {
    return this._config;
  }

  @Output()
  public ngSubmit: EventEmitter<FormGroup> = new EventEmitter();

  public form: FormGroup;
  public buttonConfig: ButtonConfig;

  constructor() {
    this.buttonConfig = {
      disable: true,
    };
  }

  public ngOnInit(): void {
    const { elements } = this.config;
    const group: { [key: string]: AbstractControl } = {};

    elements.forEach((item) => {
      group[item.key] = item.required ? new FormControl(item.value, Validators.required) : new FormControl(item.value);
    });

    this.form = new FormGroup(group);
    this.form.statusChanges.subscribe((valid: string) => {
      if (valid !== 'VALID') {
        this.buttonConfig.disable = true;
        return;
      }

      this.buttonConfig.disable = false;
    });
  }

  public onSubmit(event: Event): void {
    event.stopPropagation();
    this.ngSubmit.emit(this.form);
  }
}
