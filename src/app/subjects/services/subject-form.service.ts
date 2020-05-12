import { EventEmitter, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, zip } from 'rxjs';
import { filter, map, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';

import { IFormConfig, FormElement } from '../../common/models/form';
import { Subject } from 'src/app/common/models/subject/subject';
import { TNullable } from 'src/app/common/models/utils';
import { toTitleCase } from '../../common/utils/utils';
import { ButtonConfig } from '../../common/models/button';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../components';

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
export class SubjectFormService extends BaseComponent {
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
    this.translateEvent = new EventEmitter<void>();
    this.formConfig = cloneDeep(formConfig);

    translate.onLangChange.pipe(
      startWith({}),
      switchMap(() => this.translateConfig()),
      tap(() => this.translateEvent.emit()),
      takeUntil(this.unsubscribe$),
    ).subscribe();
  }

  private translateConfigElements(): Observable<void> {
    return this.translate.get('SUBJECTS.FORM.ELEMENTS').pipe(
      take(1),
      map((elements) => this.formConfig.elements.forEach((element) => {
        const { LABEL, PLACEHOLDER } = elements[element.key.toUpperCase()];
        element.label = LABEL;
        element.placeholder = PLACEHOLDER;
      })),
    );
  }

  private translateConfigButtons(): Observable<void> {
    return this.translate.get('SUBJECTS.FORM.BUTTONS').pipe(
      take(1),
      map((buttons) => this.formConfig.buttons.forEach((button, index) => {
        button.value = buttons[index];
      })),
    );
  }

  private translateConfig(): Observable<IFormConfig> {
    return zip(this.translateConfigElements(), this.translateConfigButtons()).pipe(
      map(() => this.formConfig),
    );
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
