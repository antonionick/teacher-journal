import { FormElement } from './Form-element';

export interface IFormConfig {
  id: string;
  classes: Array<string>;
  elements: FormElement<string>[];
}
