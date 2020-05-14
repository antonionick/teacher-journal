import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { map, mergeMap, startWith, tap } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';

import { IFormConfig, FormElement } from '../../common/models/form';
import { Subject } from 'src/app/common/models/subject/subject';
import { TNullable } from 'src/app/common/models/utils';
import { toTitleCase } from '../../common/utils/utils';
import { ButtonConfig } from '../../common/models/button';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ITranslateForm } from '../../common/models/translate/translate-form';
import { ITranslateFormElements } from '../../common/models/translate/translate-form-elements';

const formConfig: IFormConfig = {
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
      key: 'teacher',
      required: true,
      controlType: 'input',
      type: 'text',
    }),
    new FormElement({
      value: '',
      key: 'cabinet',
      required: false,
      controlType: 'input',
      type: 'text',
    }),
    new FormElement({
      value: '',
      key: 'description',
      required: false,
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
export class SubjectFormService {
  private readonly formConfig: IFormConfig;

  public get config(): Observable<IFormConfig> {
    return this.translate.onLangChange.pipe(
      startWith({ lang: null }),
      mergeMap((event: LangChangeEvent) => (
        event.lang === null ? this.getFormTranslation() : of(this.convertTranslation(event))
      )),
      tap((data) => this.translateConfig(data)),
      map(() => (
        { ...this.formConfig }
      )),
    );
  }

  constructor(private translate: TranslateService) {
    this.formConfig = cloneDeep(formConfig);
  }

  private getFormTranslation(): Observable<ITranslateForm> {
    return this.translate.get('SUBJECTS.FORM').pipe(
      map(({ ELEMENTS, BUTTONS }) => (
        { elements: ELEMENTS, buttons: BUTTONS }
      )),
    );
  }

  private convertTranslation({ translations }: LangChangeEvent): ITranslateForm {
    const elements: ITranslateFormElements = translations.SUBJECTS.FORM.ELEMENTS;
    const buttons: Array<string> = translations.SUBJECTS.FORM.BUTTONS;

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

  public getSubjectByForm(form: FormGroup): Subject {
    const subject: Subject = new Subject();

    Object.keys(form.value).forEach((key) => {
      subject[key] = form.value[key] || subject[key];
    });

    subject.name = toTitleCase(subject.name);
    subject.teacher = toTitleCase(subject.teacher);
    return subject;
  }

  public updateFormData(subject: TNullable<Subject>): void {
    if (subject === null) {
      return;
    }

    const emptySubject: Subject = new Subject();
    this.formConfig.elements.forEach((item) => {
      item.value = subject[item.key] || emptySubject[item.key];
    });
  }

  public clearFormData(): void {
    this.updateFormData({} as Subject);
  }
}
