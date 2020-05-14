import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ButtonConfig } from '../../../common/models/button';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  private buttonConfig: ButtonConfig;

  @Input()
  public set config(config: ButtonConfig) {
    const { onClick } = this.buttonConfig;

    this.buttonConfig = config;
    if (!this.buttonConfig.onClick) {
      this.buttonConfig.onClick = onClick;
    }
  }

  public get config(): ButtonConfig {
    return this.buttonConfig;
  }

  constructor() {
    this.buttonConfig = new ButtonConfig();
  }
}
