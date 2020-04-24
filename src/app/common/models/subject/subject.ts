interface ISubject {
  id: number;
  name: string;
  teacher: string;
  cabinet?: string;
  description?: string;
}

export class Subject implements ISubject {
  public id: number;
  public name: string;
  public teacher: string;
  public cabinet?: string;
  public description?: string;

  constructor({
    id = null,
    name = '',
    teacher = '',
    cabinet = '',
    description = '',
  }: Partial<ISubject> = {}) {
    this.id = id;
    this.name = name;
    this.teacher = teacher;
    this.cabinet = cabinet;
    this.description = description;
  }
}
