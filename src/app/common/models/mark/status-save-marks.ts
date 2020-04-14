interface IStatusSaveMarks {
  created: boolean;
  updated: boolean;
  deleted: boolean;
}

export class StatusSaveMarks implements IStatusSaveMarks {
  public created: boolean;
  public updated: boolean;
  public deleted: boolean;

  constructor({
    created = false,
    updated = false,
    deleted = false,
  }: Partial<IStatusSaveMarks> = {}) {
    this.created = created;
    this.updated = updated;
    this.deleted = deleted;
  }
}
