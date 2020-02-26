import { Component, Input } from '@angular/core';
import { ButtonConfig } from '../../../common/entities/ButtonConfig';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input()
  public config: ButtonConfig;

  constructor() {}
}
