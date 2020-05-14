interface ISubjectTableText {
  addHeader: string;
  deleteHeader: string;
  saveChanges: string;
  teacher: string;
}

export class SubjectTableText implements ISubjectTableText {
  public addHeader: string;
  public deleteHeader: string;
  public saveChanges: string;
  public teacher: string;

  constructor({
    addHeader = '',
    deleteHeader = '',
    saveChanges = '',
    teacher = '',
  }: Partial<ISubjectTableText> = {}) {
    this.addHeader = addHeader;
    this.deleteHeader = deleteHeader;
    this.saveChanges = saveChanges;
    this.teacher = teacher;
  }
}
