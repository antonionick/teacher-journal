export interface IMark {
  subject: {
    id: number;
    students: Array<{ id: number, marks: Array<number> }>;
  };
}
