import { HttpHeaders, HttpParams } from '@angular/common/http';

interface IOptions {
  headers: HttpHeaders;
  params: HttpParams;
}

export class Options implements IOptions {
  public headers: HttpHeaders;
  public params: HttpParams;

  constructor({
    headers = new HttpHeaders(),
    params = new HttpParams(),
  }: Partial<IOptions> = {}) {
    this.headers = headers;
    this.params = params;
  }
}
