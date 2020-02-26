export class FormElement<T> {
  public value: T;
  public key: string;
  public label: string;
  public placeholder: string;
  public required: boolean;
  public controlType: string;
  public type: string;
  public classNames: Array<string>;

  constructor(
    options: {
      value?: T;
      key?: string;
      label?: string;
      placeholder?: string;
      required?: boolean;
      controlType?: string;
      type?: string;
      classNames?: Array<string>;
    } = {},
  ) {
    this.value = options.value;
    this.key = options.key ? options.key : '';
    this.label = options.label ? options.label : '';
    this.placeholder = options.placeholder ? options.placeholder : '';
    this.required = !!options.required;
    this.controlType = options.controlType ? options.controlType : '';
    this.type = options.type ? options.type : '';
    this.classNames = options.classNames ? options.classNames : [''];
  }
}
