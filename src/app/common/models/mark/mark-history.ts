interface IMarkHistory {
  studentId: number;
  value: number;
  isDeleted: boolean;
}

export class MarkHistory implements IMarkHistory {
  public studentId: number;
  public value: number;
  public isDeleted: boolean;

  constructor({
    studentId,
    value,
    isDeleted = false,
  }: Partial<IMarkHistory> = {}) {
    this.studentId = studentId;
    this.value = value;
    this.isDeleted = isDeleted;
  }
}
