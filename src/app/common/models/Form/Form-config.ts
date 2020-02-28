import { FormElement } from './Form-element';

export interface FormConfig {
  id: string;
  classes: Array<string>;
  elements: FormElement<string>[];
}
