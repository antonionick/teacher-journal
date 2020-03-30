import { TNullable } from './utils/tnullable';

interface IStudent {
  id: TNullable<number>;
  name: string;
  lastName: string;
  subjects: Array<number>;
  address?: string;
  description?: string;
}

export class Student {
  public id: TNullable<number>;
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
