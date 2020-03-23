import { FormElement } from './form-element';
import { IButtonConfig } from '../button/button-config';

export interface IFormConfig {
  id: string;
  classes: Array<string>;
  elements: FormElement<string>[];
  buttons: Array<IButtonConfig>;
}
