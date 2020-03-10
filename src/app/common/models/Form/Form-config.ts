import { FormElement } from './Form-element';
import { IButtonConfig } from '../Button-config';

export interface IFormConfig {
  id: string;
  classes: Array<string>;
  elements: FormElement<string>[];
  buttons: Array<IButtonConfig>;
}
