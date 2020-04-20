interface IHighlightMark {
  middleMark: number;
  lessMiddleColor: string;
  middleAndHigherColor: string;
}

export class HighlightMark implements IHighlightMark {
  public middleMark: number;
  public lessMiddleColor: string;
  public middleAndHigherColor: string;

  constructor({
    middleMark = 5,
    lessMiddleColor = 'blue',
    middleAndHigherColor = 'green',
  }: Partial<IHighlightMark> = {}) {
    this.middleMark = middleMark;
    this.lessMiddleColor = lessMiddleColor;
    this.middleAndHigherColor = middleAndHigherColor;
  }
}
