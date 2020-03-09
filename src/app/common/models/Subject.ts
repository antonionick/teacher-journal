interface ISubject {
  id: number;
  name: string;
  teacher: string;
  students: Array<number>;
  cabinet?: string;
  description?: string;
}

export class Subject implements ISubject {
  public id: number;
  public name: string;
  public teacher: string;
  public students: Array<number>;
  public cabinet?: string;
  public description?: string;

  constructor({
    id = null,
    name = '',
    teacher = '',
    students = [],
    cabinet = '',
    description = '',
  }: Partial<ISubject> = {}) {
    this.id = id;
    this.name = name;
    this.teacher = teacher;
    this.students = students;
    this.cabinet = cabinet;
    this.description = description;
  }
}
