export interface ISubject {
  id: number;
  name: string;
  teacher: string;
  students: Array<number>;
  cabinet?: string;
  description?: string;
}
