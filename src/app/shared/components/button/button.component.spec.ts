import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ButtonComponent } from './button.component';
import { ButtonConfig } from '../../../common/models/button';

describe('ButtonComponent', () => {
  describe('@Input config', () => {
    let component: ButtonComponent;
    let fixture: ComponentFixture<ButtonComponent>;
    let debugElement: DebugElement;
    let nativeElement: HTMLInputElement;
    let config: ButtonConfig;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ButtonComponent],
      });

      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement.query(By.css('.button'));
      nativeElement = debugElement.nativeElement;
      config = new ButtonConfig();
      component.config = config;
    });

    it('should set passed button config', () => {
      expect(component.config).toEqual(config);
    });

    it('should set data to element from config', () => {
      fixture.detectChanges();

      expect(nativeElement.type).toBe(config.type);
      expect(nativeElement.disabled).toBe(config.disable);
    });

    it('should call onClick function by click', () => {
      fixture.detectChanges();
      spyOn(config, 'onClick');

      debugElement.triggerEventHandler('click', null);
      expect(config.onClick).toHaveBeenCalled();
      expect(config.onClick).toHaveBeenCalledTimes(1);
    });
  });
});
