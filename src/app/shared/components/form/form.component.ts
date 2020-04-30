import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';

import { IFormConfig } from '../../../common/models/form';
import { ButtonConfig } from 'src/app/common/models/button/button-config';
import { BaseComponent } from '../../../components';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent extends BaseComponent implements OnInit, OnDestroy {
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

  private updateConfigButton(): void {
    this.submitButton = this.config.buttons[0]
      ? this.config.buttons[0]
      : {
        disable: false,
      } as ButtonConfig;
    this.submitButton.disable = !this.form.valid;
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
    this.form.statusChanges.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe((valid: string) => {
      const resultValid: boolean = valid !== 'VALID';
      if (resultValid === this.submitButton.disable) {
        return;
      }

      this.submitButton.disable = resultValid;
      if (this.config.buttons.length === 0) {
        return;
      }

      this.config.buttons = this.config.buttons.map((button) => (
        { ...button }
      ));
      this.updateConfigButton();
    });

    this.updateConfigButton();
  }

  public onSubmit(event: Event): void {
    event.stopPropagation();
    this.submit.emit(this.form);
  }

  public ngOnDestroy(): void {
    this.submitButton.disable = true;
  }
}
