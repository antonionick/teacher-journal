interface IMark {
  id: number;
  studentId: number;
  subjectId: number;
  date: number;
  value: number;
}

export class Mark implements IMark {
  public id: number;
  public studentId: number;
  public subjectId: number;
  public date: number;
  public value: number;

  constructor({
    id = null,
    studentId = 0,
    subjectId = 0,
    date = Date.now(),
    value = 0,
  }: Partial<IMark> = {}) {
    this.id = id;
    this.studentId = studentId;
    this.subjectId = subjectId;
    this.date = date;
    this.value = value;
  }
}
