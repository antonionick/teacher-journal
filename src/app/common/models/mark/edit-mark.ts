interface IEditMark {
  targetTag: string;
  targetClasses: Array<string>;
  inputClasses: Array<string>;
  min: number;
  max: number;
}

export class EditMark implements IEditMark {
  public targetTag: string;
  public targetClasses: Array<string>;
  public inputClasses: Array<string>;
  public min: number;
  public max: number;

  constructor({
    targetTag = 'span',
    targetClasses = [],
    inputClasses = [],
    min = 0,
    max = 10,
  }: Partial<IEditMark> = {}) {
    this.targetTag = targetTag;
    this.targetClasses = targetClasses;
    this.inputClasses = inputClasses;
    this.min = min;
    this.max = max;
  }
}
