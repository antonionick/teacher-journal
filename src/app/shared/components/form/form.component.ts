import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { Subscription } from 'rxjs';

import { IFormConfig } from '../../../common/models/form';
import { ButtonConfig } from 'src/app/common/models/button/button-config';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private config: IFormConfig;

  @Input('config')
  public set formConfig(config: IFormConfig) {
    this.config = config;
  }
  public get formConfig(): IFormConfig {
    return this.config;
  }

  @Output()
  public submit: EventEmitter<FormGroup> = new EventEmitter();
  public form: FormGroup;
  public submitButton: ButtonConfig;

  public ngOnInit(): void {
    const { elements } = this.config;
    const group: { [key: string]: AbstractControl } = {};

    elements.forEach((item) => {
      group[item.key] = item.required
        ? new FormControl(item.value, Validators.required)
        : new FormControl(item.value);
    });

    this.form = new FormGroup(group);
    this.subscription = this.form.statusChanges.subscribe((valid: string) => {
      if (valid !== 'VALID') {
        this.submitButton.disable = true;
        return;
      }

      this.submitButton.disable = false;
    });

    this.submitButton = this.config.buttons[0]
      ? this.config.buttons[0]
      : {
        disable: false,
      } as ButtonConfig;
  }

  public onSubmit(event: Event): void {
    event.stopPropagation();
    this.submit.emit(this.form);
  }

  public ngOnDestroy(): void {
    this.submitButton.disable = true;
    this.subscription.unsubscribe();
  }
}
