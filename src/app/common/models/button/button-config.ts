interface IButtonConfig {
  value: string;
  type: string;
  disable: boolean;
  onClick?: (event: unknown) => void;
}

export class ButtonConfig implements IButtonConfig {
  public value: string;
  public type: string;
  public disable: boolean;
  public onClick?: (event: unknown) => void;

  constructor({
    value = '',
    type = 'button',
    disable = false,
    onClick = () => undefined,
  }: Partial<IButtonConfig> = {}) {
    this.value = value;
    this.type = type;
    this.disable = disable;
    this.onClick = onClick;
  }
}
