import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit {
  @Input()
  public data: Array<T>;
  @Input('columnHeaders')
  public displayedColumns: Array<string>;

  constructor() {}

  public ngOnInit(): void {}
}
