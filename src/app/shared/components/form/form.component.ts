import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { IFormConfig } from '../../../common/models/Form/Form-config';
import { IButtonConfig } from '../../../common/models/Button-config';
import { Subscription } from 'rxjs';

const buttonConfig: IButtonConfig = {
  disable: true,
};

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
  public ngSubmit: EventEmitter<FormGroup> = new EventEmitter();
  public form: FormGroup;
  public buttonConfig: IButtonConfig;

  constructor() {
    this.buttonConfig = buttonConfig;
  }

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

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
