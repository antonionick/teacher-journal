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
  getNumberInRange,
  validKeyCodesInteger as validKeyCodes,
  checkValidKeyCodes,
} from '../helpers/validate-number-input';
import { EditMark } from '../models/mark';
import { TNullable } from '../models/utils/tnullable';
import { IChangeField } from '../models/table';

@Directive({
  selector: '[appEditMark]',
})
export class EditMarkDirective {
  private config: EditMark;
  private input: HTMLInputElement;
  private child: HTMLElement;
  private sourceChildDisplay: string;
  private sourceMark: number;
  private isProcess: boolean;

  @Input('column')
  public column: string;
  @Input()
  public row: string;
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
  public changeMark: EventEmitter<IChangeField<number>> = new EventEmitter();

  constructor(private elementRef: ElementRef, private render: Renderer2) { }

  @HostListener('click')
  private onClick(): void {
    this.startEdit();
  }

  @HostListener('keyup.enter')
  private onEnter(): void {
    this.endEdit();
  }

  @HostListener('focusout')
  private onMouseLeave(): void {
    this.endEdit();
  }

  private resetSettings(): void {
    this.child = null;
    this.sourceChildDisplay = '';
    this.isProcess = false;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const isValid: boolean = checkValidKeyCodes(validKeyCodes, event.keyCode);
    if (!isValid) {
      event.preventDefault();
      return;
    }

    if (Number.isNaN(+event.key)) {
      return;
    }

    const { value } = this.input;
    const { min, max } = this.config;
    const fullValue: number = +(value + event.key);
    const resultValue: string = getNumberInRange(fullValue, min, max).toString();

    this.render.setProperty(this.input, 'value', resultValue);
    event.preventDefault();
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
      this.sourceMark = value !== '' ? +value : -1;
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
    this.sourceChildDisplay = getComputedStyle(this.child).display;
    this.render.setStyle(this.child, 'display', 'none');
    this.render.appendChild(parent, this.input);
    this.input.focus();
  }

  private showChildElement(parent: HTMLElement): void {
    this.render.removeChild(parent, this.input);
    this.render.setStyle(this.child, 'display', this.sourceChildDisplay);
    this.render.setProperty(this.child, 'textContent', this.input.value);
  }

  private emitChangeEvent(mark: number): void {
    const change: IChangeField<number> = {
      column: +this.column,
      row: +this.row,
      value: mark,
    };

    this.changeMark.emit(change);
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
    // if empty input, need to delete mark, but if coerce empty string to number get 0
    // -1 it's delete mark
    let mark: number = this.input.value !== '' ? +this.input.value : -1;

    this.showChildElement(parent);
    this.resetSettings();
    this.isProcess = false;

    if (this.sourceMark === mark) {
      return;
    }

    this.sourceMark = mark;
    this.emitChangeEvent(mark);
  }
}
