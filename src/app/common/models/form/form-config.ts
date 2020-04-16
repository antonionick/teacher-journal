import { FormElement } from './form-element';
import { ButtonConfig } from '../button';

export interface IFormConfig {
  id: string;
  classes: Array<string>;
  elements: FormElement<string>[];
  buttons: Array<ButtonConfig>;
}
