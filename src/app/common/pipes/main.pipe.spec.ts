import { Component, Input, PipeTransform } from '@angular/core';
import { UpperCasePipe, DecimalPipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPipe } from './main.pipe';

@Component({
  template: `<span>{{ value | main : pipe : pipeArgs }}</span>`,
})
class TestPipe {
  @Input()
  public value: string;
  @Input()
  public pipe: PipeTransform;
  @Input()
  public pipeArgs: string;
}

describe('MainPipe', () => {
  const str: string = 'hello';
  let pipe: MainPipe;
  let upperCasePipe: UpperCasePipe;
  let decimalPipe: DecimalPipe;
  let component: TestPipe;
  let fixture: ComponentFixture<TestPipe>;
  let span: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestPipe, MainPipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    pipe = new MainPipe();
    upperCasePipe = new UpperCasePipe();
    decimalPipe = new DecimalPipe('en-US');

    fixture = TestBed.createComponent(TestPipe);
    component = fixture.componentInstance;
    component.value = str;
    component.pipe = upperCasePipe;
    fixture.detectChanges();
    span = fixture.nativeElement.querySelector('span');
  });

  it('should return value if passed pipe is null', () => {
    expect(pipe.transform(str)).toBe(str);
  });

  it('should call passed pipe with passed value', () => {
    expect(pipe.transform(str, upperCasePipe)).toBe(str.toUpperCase());
  });

  it('should call passed pipe with parameter', () => {
    expect(pipe.transform('123.562', decimalPipe, '5.0-1')).toBe('00,123.6');
  });

  it('should use passed pipe in DOM', () => {
    expect(span.textContent).toBe(str.toUpperCase());
  });

  it('should use passed parameter in DOM', () => {
    component.value = '123.562';
    component.pipe = decimalPipe;
    component.pipeArgs = '5.0-1';
    fixture.detectChanges();

    expect(span.textContent).toBe('00,123.6');
  });
});
