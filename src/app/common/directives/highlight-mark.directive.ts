import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';

import { HighlightMark } from '../models/mark';
import { TNullable } from '../models/utils';

@Directive({
  selector: '[appHighlightMark]',
})
export class HighlightMarkDirective implements OnChanges {
  private config: HighlightMark;
  private prevValue: TNullable<number>;
  private value: TNullable<number>;
  private defaultColor: TNullable<string>;

  @Input('config')
  set setConfig(config: HighlightMark) {
    if (config instanceof HighlightMark) {
      this.config = config;
    } else {
      this.config = new HighlightMark();
    }
  }

  @Input('value')
  set setValue(value: string) {
    this.prevValue = this.value;
    this.value = value === '' ? null : +value;
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.value = this.prevValue = this.defaultColor = null;
  }

  private assignDefaultColor(): void {
    const { nativeElement: { parentElement } } = this.elementRef;
    this.defaultColor = getComputedStyle(parentElement).borderBottomColor;
  }

  private getWidth(color: string): number {
    return color === this.defaultColor ? 1 : 2;
  }

  private updateColor(width: number, color: string): void {
    const { nativeElement: { parentElement } } = this.elementRef;

    this.renderer.setStyle(parentElement, 'border-bottom', `${ width }px solid ${ color }`);
  }

  private isChanged(): boolean {
    if (this.prevValue === null) {
      return true;
    }

    const { config: { middleMark }, value: current, prevValue: prev } = this;
    return current >= middleMark && prev < middleMark ||
      current < middleMark && prev >= middleMark;
  }

  private getColor(): string {
    if (this.value === null) {
      return this.defaultColor;
    }

    const { middleMark, lessMiddleColor, middleAndHigherColor } = this.config;
    return this.value >= middleMark ? middleAndHigherColor : lessMiddleColor;
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
    const width: number = this.getWidth(color);
    this.updateColor(width, color);
  }
}
