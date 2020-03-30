interface IKeyCheck {
  value: number;
  from: number;
  to: number;
  range: boolean;
}

export class KeyCheck implements IKeyCheck {
  public value: number;
  public from: number;
  public to: number;
  public range: boolean;

  constructor({ value = 0, from = 0, to = 0, range = false }: Partial<IKeyCheck> = {}) {
    this.value = value;
    this.from = from;
    this.to = to;
    this.range = range;
  }
}
