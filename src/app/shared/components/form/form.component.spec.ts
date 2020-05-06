import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

import { FormComponent } from './form.component';
import { FormElement, IFormConfig } from '../../../common/models/form';
import { ButtonConfig } from '../../../common/models/button';
import { ButtonComponent } from '..';

describe('FormComponent', () => {
  describe('@Input config', () => {
    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;
    let config: IFormConfig;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FormComponent, ButtonComponent],
      });

      config = {
        id: '1',
        classes: [],
        elements: [
          new FormElement<string>({
            value: 'Unknown FirstName',
            key: 'name',
            required: true,
          }),
        ],
        buttons: [
          new ButtonConfig({ value: 'Save', type: 'submit' }),
        ],
      };

      fixture = TestBed.createComponent(FormComponent);
      component = fixture.componentInstance;
      component.formConfig = config;
    });

    it('should set passed config', () => {
      fixture.detectChanges();

      expect(component.formConfig).toBe(config);
    });

    it('should create FromGroup by elements of config', () => {
      fixture.detectChanges();

      config.elements.forEach((item) => {
        const control: AbstractControl = component.form.get(item.key);
        expect(item.value).toBe(control.value);
      });
    });

    it('should disable button if form did not pass validation', () => {
      config.elements[0].value = null;
      component.formConfig = config;
      fixture.detectChanges();

      expect(component.form.valid).toBeFalse();
      expect(component.submitButton.disable).toBeTrue();
    });
  });

  describe('create and interact with DOM elements', () => {
    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;
    let debugElement: DebugElement;
    let nativeElement: HTMLElement;
    let config: IFormConfig;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [FormComponent, ButtonComponent],
      });

      config = {
        id: '1',
        classes: [],
        elements: [
          new FormElement<string>({
            value: 'Unknown FirstName',
            key: 'name',
            placeholder: 'Enter name:',
            controlType: 'input',
            required: true,
          }),
        ],
        buttons: [
          new ButtonConfig({ value: 'Save', type: 'submit' }),
        ],
      };

      fixture = TestBed.createComponent(FormComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      nativeElement = debugElement.nativeElement;
      component.formConfig = config;
    });

    it('should create input element', () => {
      fixture.detectChanges();
      expect(debugElement.query(By.css('input')).nativeElement).toBeTruthy();
    });

    it('should create textarea element', () => {
      config.elements.push(new FormElement({ controlType: 'textarea' }));
      component.formConfig = config;
      fixture.detectChanges();

      expect(debugElement.query(By.css('textarea')).nativeElement).toBeTruthy();
    });

    it('should create the same number of elements as in the elements of config', () => {
      config.elements.push(
        new FormElement<string>({ controlType: 'input' }),
        new FormElement<string>({ controlType: 'input' }),
      );
      component.formConfig = config;
      fixture.detectChanges();

      const inputs: Array<DebugElement> = debugElement.queryAll(By.css('input'));
      expect(inputs.length).toBe(3);
    });

    it('should create element only if controlType specified', () => {
      config.elements.push(
        new FormElement<string>({ controlType: 'input' }),
        new FormElement<string>(),
      );

      component.formConfig = config;
      fixture.detectChanges();

      const inputs: Array<DebugElement> = debugElement.queryAll(By.css('input'));
      expect(inputs.length).toBe(2);
    });

    it('should pass data from the config to the element', () => {
      fixture.detectChanges();

      const input: HTMLInputElement = debugElement.query(By.css('input')).nativeElement;
      expect(input.value).toBe(config.elements[0].value);
      expect(input.name).toBe(config.elements[0].key);
      expect(input.placeholder).toBe(config.elements[0].placeholder);
    });

    it('should check validation when element change', () => {
      fixture.detectChanges();
      expect(component.form.valid).toBeTrue();
      component.form.get('name').setValue(null);

      fixture.detectChanges();
      expect(component.form.valid).toBeFalse();
    });

    it('should create button element', () => {
      fixture.detectChanges();
      expect(debugElement.query(By.css('.button')).nativeElement).toBeTruthy();
    });

    it('should pass button config to app-button component', () => {
      fixture.detectChanges();

      const button: DebugElement = debugElement.query(By.css('.button'));
      expect(button.componentInstance.config).toBe(config.buttons[0]);
    });

    it('should create the same number of buttons as in the config.buttons', () => {
      config.buttons.push(
        new ButtonConfig(),
        new ButtonConfig(),
        new ButtonConfig(),
      );
      component.formConfig = config;
      fixture.detectChanges();

      const buttons: Array<DebugElement> = debugElement.queryAll(By.css('.button'));
      expect(buttons.length).toBe(4);
    });
  });
});
