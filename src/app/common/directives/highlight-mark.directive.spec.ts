import { By } from '@angular/platform-browser';
import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightMarkDirective } from './';
import { HighlightMark } from '../models/mark';

@Component({
  template: `<span appHighlightMark [config]="config" [value]="value"></span>`,
})
class TestContainerComponent {
  @Input()
  public config: HighlightMark;
  @Input()
  public value: string;
}

describe('HighlightMarkDirective', () => {
  describe('@Input config', () => {
    let directive: HighlightMarkDirective;
    let config: HighlightMark;

    beforeEach(() => {
      directive = new HighlightMarkDirective({} as ElementRef, {} as Renderer2);
      config = new HighlightMark();
    });

    it('should create config by default', () => {
      expect(directive.config).toEqual(new HighlightMark());
    });

    it('should set passed config', () => {
      directive.config = config;

      expect(directive.config).toBe(config);
    });

    it('should do nothing if passed config is not HighlightMark', () => {
      const existingConfig: HighlightMark = directive.config;
      directive.config = null;

      expect(directive.config).toBe(existingConfig);
    });
  });

  describe('@Input value', () => {
    let directive: HighlightMarkDirective;

    beforeEach(() => {
      directive = new HighlightMarkDirective({} as ElementRef, {} as Renderer2);
    });

    it('should set null by default, if did not pass value', () => {
      expect(directive.value).toBeNull();
    });

    it('should set passed value', () => {
      directive.value = '5';

      expect(directive.value).toBe('5');
    });

    it('should set null if passed value is false in coerce to boolean', () => {
      directive.value = '';
      expect(directive.value).toBeNull();

      directive.value = null;
      expect(directive.value).toBeNull();

      directive.value = undefined;
      expect(directive.value).toBeNull();
    });

    it('should set previousValue by value of the currentValue before change', () => {
      directive.value = '5';
      expect(directive.value).toBe('5');
      expect(directive.previousValue).toBeNull();

      directive.value = '7';
      expect(directive.value).toBe('7');
      expect(directive.previousValue).toBe('5');
    });
  });

  describe('isChanged', () => {
    let directive: HighlightMarkDirective;

    beforeEach(() => {
      directive = new HighlightMarkDirective({} as ElementRef, {} as Renderer2);
    });

    it('should return true if currentValue or prevValue is null', () => {
      expect(directive.isChanged()).toBe(true);

      directive.value = '5';
      expect(directive.isChanged()).toBe(true);

      directive.value = '5';
      expect(directive.isChanged()).toBe(false);
    });

    it(
      'should return true if currentValue more or equal that middleMark, and prevValue less',
      () => {
        directive.value = '3';
        directive.value = '5';

        expect(directive.isChanged()).toBe(true);
      },
    );

    it(
      'should return true if currentValue less that middleMark, and prevValue more or equal',
      () => {
        directive.value = '5';
        directive.value = '3';

        expect(directive.isChanged()).toBe(true);
      },
    );

    it(
      'should return false if current and prev value are both >= or < that middleMark',
      () => {
        directive.value = '7';
        directive.value = '6';
        expect(directive.isChanged()).toBe(false);

        directive.value = '3';
        directive.value = '4';
        expect(directive.isChanged()).toBe(false);
      },
    );
  });

  describe('getColor', () => {
    const config: HighlightMark = new HighlightMark();
    let directive: HighlightMarkDirective;

    beforeEach(() => {
      directive = new HighlightMarkDirective({} as ElementRef, {} as Renderer2);
    });

    it('should return defaultColor if currentValue is null', () => {
      expect(directive.getColor()).toBe(null);
    });

    it('should return middleAndHigherColor if currentValue >= middleMark', () => {
      directive.value = '5';
      expect(directive.getColor()).toBe(config.middleAndHigherColor);
    });

    it('should return lessMiddleColor if currentValue < middleMark', () => {
      directive.value = '3';
      expect(directive.getColor()).toBe(config.lessMiddleColor);
    });
  });

  describe('computeWidth', () => {
    const color: string = 'rgb(0, 0, 255)';
    let directive: HighlightMarkDirective;
    let fixture: ComponentFixture<TestContainerComponent>;
    let parentElement: HTMLElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [TestContainerComponent, HighlightMarkDirective],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestContainerComponent);
      parentElement = fixture.nativeElement;
      parentElement.style.borderBottom = `1px solid ${ color }`;

      fixture.detectChanges();
      directive = fixture.debugElement.query(By.css('span'))
        .injector.get(HighlightMarkDirective);
    });

    it('should assign defaultColor when ngOnChanges calls', () => {
      expect(directive.parentDefaultColor).toBe(color);
    });

    it('should return 1 if color equal defaultColor', () => {
        expect(directive.computeWidth(color)).toBe(1);
    });

    it('should return 2 if color is not equal defaultColor', () => {
      expect(directive.computeWidth('red')).toBe(2);
    });
  });

  describe('highlight', () => {
    let component: TestContainerComponent;
    let fixture: ComponentFixture<TestContainerComponent>;
    let directive: HighlightMarkDirective;
    let element: HTMLSpanElement;
    let config: HighlightMark;
    let borderColor: string;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [TestContainerComponent, HighlightMarkDirective],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestContainerComponent);
      component = fixture.componentInstance;
      config = new HighlightMark({
        middleMark: 5,
        lessMiddleColor: 'rgb(255, 0, 0)',
        middleAndHigherColor: `rgb(0, 0, 255)`,
      });

      component.config = config;
      fixture.detectChanges();

      element = fixture.debugElement.nativeElement;
      directive = fixture.debugElement.query(By.css('span'))
        .injector.get(HighlightMarkDirective);
    });

    it('should create directive', () => {
      expect(directive).not.toBeNull();
    });

    it('should highlight parent element', () => {
      component.value = '5';
      fixture.detectChanges();

      borderColor = getComputedStyle(element).borderBottomColor;
      expect(borderColor).toBe(config.middleAndHigherColor);
    });

    it('should chose lessMiddleColor for highlight if value less than middleMark', () => {
      component.value = '3';
      fixture.detectChanges();

      borderColor = getComputedStyle(element).borderBottomColor;
      expect(borderColor).toBe(config.lessMiddleColor);
    });

    it('should chose middleAndHigherColor for highlight if value more than middleMark', () => {
      component.value = '8';
      fixture.detectChanges();

      borderColor = getComputedStyle(element).borderBottomColor;
      expect(borderColor).toBe(config.middleAndHigherColor);
    });

    it('should choose 1 width of highlight if color is defaultColor', () => {
      const width: number = parseInt(getComputedStyle(element).borderBottomWidth, 10);

      expect(width).toBe(1);
    });

    it('should choose 2 width of highlight if color is not defaultColor', () => {
      let width: number;

      component.value = '5';
      fixture.detectChanges();
      width = parseInt(getComputedStyle(element).borderBottomWidth, 10);
      expect(width).toBe(2);

      component.value = '3';
      fixture.detectChanges();
      width = parseInt(getComputedStyle(element).borderBottomWidth, 10);
      expect(width).toBe(2);

      component.value = '';
      fixture.detectChanges();
      width = parseInt(getComputedStyle(element).borderBottomWidth, 10);
      expect(width).toBe(1);
    });
  });
});
