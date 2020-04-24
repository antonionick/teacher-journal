interface IBreadcrumb {
  name: string;
  path: string;
}

export class Breadcrumb implements IBreadcrumb {
  public name: string;
  public path: string;

  constructor({
    name = '',
    path = '',
  }: Partial<IBreadcrumb>) {
    this.name = name;
    this.path = path;
  }
}
