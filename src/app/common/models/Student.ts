interface IStudent {
  id: number | null;
  name: string;
  lastName: string;
  subjects: Array<number>;
  address?: string;
  description?: string;
}

export class Student {
  public id: number | null;
  public name: string;
  public lastName: string;
  public subjects: Array<number>;
  public address?: string;
  public description?: string;

  constructor({
    id = null,
    name = '',
    lastName = '',
    subjects = [],
    address = '',
    description = '',
  }: Partial<IStudent> = {}) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.subjects = subjects;
    this.address = address;
    this.description = description;
  }
}
