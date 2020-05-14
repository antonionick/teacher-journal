import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { Observable, of } from 'rxjs';
import { map, mergeMap, startWith, tap } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';

import { IFormConfig, FormElement } from '../../common/models/form';
import { Student } from '../../common/models/student';
import { ButtonConfig } from '../../common/models/button';
import { ITranslateFormElements } from '../../common/models/translate/translate-form-elements';
import { ITranslateForm } from '../../common/models/translate/translate-form';

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
export class StudentFormService {
  private readonly formConfig: IFormConfig;

  public get config(): Observable<IFormConfig> {
    return this.translate.onLangChange.pipe(
      startWith({ lang: null }),
      mergeMap((event: LangChangeEvent) => (
        event.lang === null ? this.getFormTranslation() : of(this.convertTranslation(event))
      )),
      tap((data: ITranslateForm) => this.translateConfig(data)),
      map(() => (
        { ...this.formConfig }
      )),
    );
  }

  constructor(private translate: TranslateService) {
    this.formConfig = cloneDeep(initialConfig);
  }

  private getFormTranslation(): Observable<ITranslateForm> {
    return this.translate.get('STUDENTS.FORM').pipe(
      map(({ ELEMENTS, BUTTONS }) => (
        { elements: ELEMENTS, buttons: BUTTONS }
      )),
    );
  }

  private convertTranslation({ translations }: LangChangeEvent): ITranslateForm {
    const elements: ITranslateFormElements = translations.STUDENTS.FORM.ELEMENTS;
    const buttons: Array<string> = translations.STUDENTS.FORM.BUTTONS;

    return { elements, buttons };
  }

  private translateConfigElements(elements: ITranslateFormElements): void {
    this.formConfig.elements.forEach((element) => {
      const { LABEL, PLACEHOLDER } = elements[element.key.toUpperCase()];
      element.label = LABEL;
      element.placeholder = PLACEHOLDER;
    });
  }

  private translateConfigButtons(buttons: Array<string>): void {
    this.formConfig.buttons.forEach((button, index) => (
      button.value = buttons[index]
    ));
  }

  private translateConfig({ elements, buttons }: ITranslateForm): void {
    this.translateConfigElements(elements);
    this.translateConfigButtons(buttons);
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
