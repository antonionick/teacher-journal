import { Component, Input } from '@angular/core';

import { IButtonConfig } from '../../../common/models/Button-config';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  private buttonConfig: IButtonConfig;

  @Input()
  public set config(config: IButtonConfig) {
    const { onClick } = this.buttonConfig;

    this.buttonConfig = config;
    if (!this.buttonConfig.onClick) {
      this.buttonConfig.onClick = onClick;
    }
  }

  public get config(): IButtonConfig {
    return this.buttonConfig;
  }

  constructor() {
    this.buttonConfig = {
      type: 'button',
      disable: false,
      onClick: (event: Event) => undefined,
    } as IButtonConfig;
  }
}
