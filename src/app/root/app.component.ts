import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public languages: Array<string>;
  public selected: string;

  constructor(private translate: TranslateService) {
    translate.use('en');
    this.languages = ['en', 'ru'];
    this.selected = 'en';
  }

  public onChangeLang({ value }: MatSelectChange): void {
    this.translate.use(value);
  }
}
