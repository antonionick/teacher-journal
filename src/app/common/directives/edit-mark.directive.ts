import {
  Directive,
  Input,
  Renderer2,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';

import {
  handleKeyDown as keyDown,
  validKeyCodesInteger as validKeyCodes,
} from '../helpers/validate-number-input';
import { EditMark } from '../models/Edit-mark';
import { TNullable } from '../models/TNullable';

@Directive({
  selector: '[appEditMark]',
})
export class EditMarkDirective {
  private config: EditMark;
  private input: HTMLInputElement;
  private child: HTMLElement;
  private childDisplay: string;
  private isChildHide: boolean;
  private isProcess: boolean;
  private sourceMark: number;

  @Input('editMarkConfig')
  public set appEditMark(config: TNullable<EditMark>) {
    if (config instanceof EditMark) {
      this.config = config;
    } else if (config === null) {
      this.config = null;
    } else {
      this.config = new EditMark();
    }

    this.input = null;
    this.resetSettings();
  }

  @Output()
  public changeMark: EventEmitter<number> = new EventEmitter();

  constructor(private elementRef: ElementRef, private render: Renderer2) {}

  private resetSettings(): void {
    this.child = null;
    this.isChildHide = false;
    this.childDisplay = '';
    this.isProcess = false;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    keyDown.call(this, validKeyCodes, this.input, this.config, event);
  }

  private createInput(value: string): HTMLInputElement {
    const { min, max } = this.config;
    const classes: string = this.config.inputClasses.join(' ');
    const input: HTMLInputElement = this.render.createElement('input');

    this.render.setProperty(input, 'value', value);
    this.render.setAttribute(input, 'type', 'number');
    this.render.setAttribute(input, 'min', min.toString());
    this.render.setAttribute(input, 'max', max.toString());
    this.render.listen(input, 'keydown', this.handleKeyDown.bind(this));

    if (classes !== '') {
      this.render.addClass(input, classes);
    }

    return input;
  }

  private updateInput(value: string): HTMLInputElement {
    if (!this.input) {
      this.sourceMark = +value;
      return this.createInput(value);
    }

    this.render.setProperty(this.input, 'value', value);
    return this.input;
  }

  private searchChildElement(parent: HTMLElement): TNullable<HTMLElement> {
    const { targetTag: tag, targetClasses: classes } = this.config;
    let query: string = `${tag}`;

    if (classes.length !== 0) {
      query += `.${classes.join(' ')}`;
    }

    return parent.querySelector(query);
  }

  private hideChildElement(parent: HTMLElement): void {
    this.childDisplay = getComputedStyle(this.child).display;
    this.render.setStyle(this.child, 'display', 'none');
    this.render.appendChild(parent, this.input);
    this.input.focus();
  }

  private showChildElement(parent: HTMLElement): void {
    this.render.removeChild(parent, this.input);
    this.render.setStyle(this.child, 'display', this.childDisplay);
    this.render.setProperty(this.child, 'textContent', this.input.value);
  }

  private startEdit(): void {
    if (this.config === null || this.isProcess) {
      return;
    }

    const { nativeElement: parent } = this.elementRef;
    const child: HTMLElement = this.searchChildElement(parent);
    if (child === null) {
      return;
    }

    const { textContent: value } = child;
    this.child = child;
    this.input = this.updateInput(value.trim());
    this.hideChildElement(parent);
    this.isProcess = true;
  }

  private endEdit(): void {
    if (!this.isProcess) {
      return;
    }

    const { nativeElement: parent } = this.elementRef;
    const mark: number = +this.input.value;

    this.showChildElement(parent);
    this.resetSettings();
    this.isProcess = false;

    if (this.sourceMark === mark) {
      return;
    }

    this.sourceMark = mark;
    console.log('emit');
    this.changeMark.emit(mark);
  }

  @HostListener('click')
  public onClick(): void {
    this.startEdit();
  }

  @HostListener('keyup.enter')
  public onEnter(): void {
    this.endEdit();
  }

  @HostListener('focusout')
  public onMouseLeave(): void {
    this.endEdit();
  }
}
