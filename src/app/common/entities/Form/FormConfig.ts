import { FormElement } from './FormElement';

export interface FormConfig {
  id: string;
  classes: Array<string>;
  elements: FormElement<string>[];
}
