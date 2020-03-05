interface IStudent {
  id: number | null;
  name: string;
  lastName: string;
  address?: string;
  description?: string;
}

export class Student {
  public id: number | null;
  public name: string;
  public lastName: string;
  public address?: string;
  public description?: string;

  constructor({
    id = null,
    name = '',
    lastName = '',
    address = '',
    description = '',
  }: Partial<IStudent> = {}) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.address = address;
    this.description = description;
  }
}
