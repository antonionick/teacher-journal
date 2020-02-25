import { Component, OnInit, Input } from '@angular/core';
import { FormConfig } from '../../../common/entities/FormConfig';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input()
  public config: FormConfig;

  constructor() {}

  public ngOnInit(): void {}
}
