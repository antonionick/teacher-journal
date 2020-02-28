interface IFormElement<T> {
  value: T;
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
  controlType: string;
  type: string;
  classNames: Array<string>;
}

export class FormElement<T> {
  public value: T;
  public key: string;
  public label: string;
  public placeholder: string;
  public required: boolean;
  public controlType: string;
  public type: string;
  public classNames: Array<string>;

  constructor({
    value,
    key = '',
    label = '',
    placeholder = '',
    required = false,
    controlType = '',
    type = '',
    classNames = [],
  }: Partial<IFormElement<T>> = {}) {
    this.value = value;
    this.key = key;
    this.label = label;
    this.placeholder = placeholder;
    this.required = required;
    this.controlType = controlType;
    this.type = type;
    this.classNames = classNames;
  }
}
