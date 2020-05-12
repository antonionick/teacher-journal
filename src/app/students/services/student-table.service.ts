import { EventEmitter, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { exhaustMap, filter, map, startWith, takeUntil, tap } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';

import { TableHeaderConfig, TableCellConfig, ITableBodyConfig } from 'src/app/common/models/table';
import { Student } from 'src/app/common/models/student';
import { BaseComponent } from '../../components';

const displayedColumns: Array<TableHeaderConfig> = [
  new TableHeaderConfig({
    title: 'id',
    sort: true,
  }),
  new TableHeaderConfig({
    title: 'delete',
    isVisible: false,
  }),
  new TableHeaderConfig({
    title: 'name',
    sort: true,
  }),
  new TableHeaderConfig({
    title: 'lastName',
    sort: true,
  }),
  new TableHeaderConfig({
    title: 'address',
    sort: true,
  }),
  new TableHeaderConfig({
    title: 'description',
    sort: true,
  }),
];

@Injectable()
export class StudentTableService extends BaseComponent {
  private translateEvent: EventEmitter<void>;
  private readonly displayedColumns: Array<TableHeaderConfig>;

  public get headers(): Observable<Array<TableHeaderConfig>> {
    return this.translateEvent.pipe(
      startWith({}),
      filter(() => this.displayedColumns.every((header) => header.content !== null)),
      map(() => this.displayedColumns),
    );
  }

  constructor(private translate: TranslateService) {
    super();
    this.translateEvent = new EventEmitter<void>();
    this.displayedColumns = cloneDeep(displayedColumns);

    translate.onLangChange.pipe(
      startWith({}),
      exhaustMap(() => this.translateDisplayedColumns()),
      tap(() => this.translateEvent.emit()),
      takeUntil(this.unsubscribe$),
    ).subscribe();
  }

  private translateDisplayedColumns(): Observable<void> {
    return this.translate.get('STUDENTS.TABLE').pipe(
      map((headers) => this.displayedColumns.forEach((item, index) =>
        item.content = headers[index],
      )),
    );
  }

  public addDeleteButtonToStudentConfig(student: ITableBodyConfig): void {
    student.delete = new TableCellConfig({ isExternal: true });
  }

  public getTableBodyConfig(students: Array<Student>): Array<ITableBodyConfig> {
    if (students.length === 0) {
      return [];
    }

    const studentKeys: Array<string> = Object.keys(students[0]);

    return students.map((student) => {
      const studentConfig: ITableBodyConfig = {};

      studentKeys.map((key) => {
        studentConfig[key] = new TableCellConfig({ value: student[key] });
      });
      this.addDeleteButtonToStudentConfig(studentConfig);

      return studentConfig;
    });
  }
}
