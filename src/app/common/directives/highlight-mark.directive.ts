import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { HighlightMark } from '../models/mark';
import { TNullable } from '../models/utils';

@Directive({
  selector: '[appHighlightMark]',
})
export class HighlightMarkDirective implements OnChanges {
  private markConfig: HighlightMark;
  private prevValue: TNullable<number>;
  private currentValue: TNullable<number>;
  private defaultColor: TNullable<string>;

  @Input()
  set config(config: HighlightMark) {
    if (config instanceof HighlightMark) {
      this.markConfig = config;
    }
  }

  get config(): HighlightMark {
    return this.markConfig;
  }

  @Input()
  set value(value: string) {
    this.prevValue = this.currentValue;
    this.currentValue = !value ? null : +value;
  }

  get value(): TNullable<string> {
    return this.currentValue === null ? null : `${ this.currentValue }`;
  }

  get previousValue(): string {
    return this.prevValue === null ? null : `${ this.prevValue }`;
  }

  get parentDefaultColor(): string {
    return this.defaultColor;
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.currentValue = this.prevValue = this.defaultColor = null;
    this.markConfig = new HighlightMark();
  }

  private assignDefaultColor(): void {
    const { nativeElement: { parentElement } } = this.elementRef;
    this.defaultColor = getComputedStyle(parentElement).borderBottomColor;
  }

  private updateColor(width: number, color: string): void {
    const { nativeElement: { parentElement } } = this.elementRef;

    this.renderer.setStyle(parentElement, 'border-bottom', `${ width }px solid ${ color }`);
  }

  public computeWidth(color: string): number {
    return color === this.defaultColor ? 1 : 2;
  }

  public isChanged(): boolean {
    if (this.prevValue === null || this.currentValue === null) {
      return true;
    }

    const { config: { middleMark }, currentValue: current, prevValue: prev } = this;
    return current >= middleMark && prev < middleMark ||
      current < middleMark && prev >= middleMark;
  }

  public getColor(): string {
    if (this.currentValue === null) {
      return this.defaultColor;
    }

    const { middleMark, lessMiddleColor, middleAndHigherColor } = this.config;
    return this.currentValue >= middleMark ? middleAndHigherColor : lessMiddleColor;
  }

  public ngOnChanges(): void {
    if (this.defaultColor === null) {
      this.assignDefaultColor();
    }

    this.process();
  }

  public process(): void {
    if (!this.isChanged()) {
      return;
    }

    const color: string = this.getColor();
    const width: number = this.computeWidth(color);
    this.updateColor(width, color);
  }
}
