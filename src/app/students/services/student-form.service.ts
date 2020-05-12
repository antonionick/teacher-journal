import { EventEmitter, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { Observable, zip } from 'rxjs';
import { filter, map, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';

import { IFormConfig, FormElement } from '../../common/models/form';
import { Student } from '../../common/models/student';
import { ButtonConfig } from '../../common/models/button';
import { BaseComponent } from '../../components';

const initialConfig: IFormConfig = {
  id: '',
  classes: [],
  elements: [
    new FormElement({
      value: '',
      key: 'name',
      required: true,
      controlType: 'input',
      type: 'text',
    }),
    new FormElement({
      value: '',
      key: 'lastName',
      required: true,
      controlType: 'input',
      type: 'text',
    }),
    new FormElement({
      value: '',
      key: 'address',
      controlType: 'input',
      type: 'text',
    }),
    new FormElement({
      value: '',
      key: 'description',
      controlType: 'textarea',
    }),
  ],
  buttons: [
    new ButtonConfig({
      type: 'submit',
      disable: true,
    }),
    new ButtonConfig({
      type: 'button',
      disable: false,
    }),
  ],
};

@Injectable()
export class StudentFormService extends BaseComponent {
  private translateEvent: EventEmitter<void>;
  private readonly formConfig: IFormConfig;

  public get config(): Observable<IFormConfig> {
    return this.translateEvent.pipe(
      startWith({}),
      filter(() => this.formConfig.elements.every(
        (element) => element.label !== '',
      )),
      map(() => (
        { ...this.formConfig }
      )),
    );
  }

  constructor(private translate: TranslateService) {
    super();
    this.formConfig = cloneDeep(initialConfig);
    this.translateEvent = new EventEmitter<void>();

    translate.onLangChange.pipe(
      startWith({}),
      switchMap(() => this.translateConfig()),
      tap(() => this.translateEvent.emit()),
      takeUntil(this.unsubscribe$),
    ).subscribe();
  }

  private translateConfigElements(): Observable<void> {
    return this.translate.get('STUDENTS.FORM.ELEMENTS').pipe(
      take(1),
      map((elements) => {
        this.formConfig.elements.forEach((element) => {
          const { LABEL, PLACEHOLDER } = elements[element.key.toUpperCase()];
          element.label = LABEL;
          element.placeholder = PLACEHOLDER;
        });
      }),
    );
  }

  private translateConfigButtons(): Observable<void> {
    return this.translate.get('STUDENTS.FORM.BUTTONS').pipe(
      take(1),
      map((buttonsText) => {
        this.formConfig.buttons.forEach((button, index) => (
          button.value = buttonsText[index]
        ));
      }),
    );
  }

  private translateConfig(): Observable<IFormConfig> {
    return zip(this.translateConfigElements(), this.translateConfigButtons()).pipe(
      map(() => this.formConfig),
    );
  }

  public getStudentByForm({ value }: FormGroup): Student {
    const student: Student = new Student();

    Object.keys(value).forEach((key) => {
      student[key] = value[key] || student[key];
    });

    return student;
  }

  public updateConfigData(student: Student): void {
    this.formConfig.elements.forEach((item) => {
      item.value = student[item.key] || '';
    });
  }

  public clearFormConfig(): void {
    const student: Student = new Student();
    this.updateConfigData(student);
  }
}
