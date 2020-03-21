interface IPaginator {
  defaultPageSize: number;
  pageSizeOptions: Array<number>;
}

export class Paginator implements IPaginator {
  public defaultPageSize: number;
  public pageSizeOptions: Array<number>;

  constructor({
    defaultPageSize = 10,
    pageSizeOptions = [5, 10, 20, 30],
  }: Partial<IPaginator> = {}) {
    this.defaultPageSize = defaultPageSize;
    this.pageSizeOptions = pageSizeOptions;
  }
}
