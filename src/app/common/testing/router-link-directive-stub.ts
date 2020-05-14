import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[routerLink]',
})
export class RouterLinkDirectiveStub {
  @Input('routerLink')
  public linkParams: Array<string> | string;
  public navigatedTo: Array<string> | string | null = null;

  @HostListener('click')
  public onClick(): void {
    this.navigatedTo = this.linkParams;
  }
}
