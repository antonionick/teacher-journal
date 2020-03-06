import { Component, Input } from '@angular/core';
import { IButtonConfig } from '../../../common/models/Button-config';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input()
  public config: IButtonConfig;
}
