import { EventEmitter, Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { Observable, of } from 'rxjs';
import { map, mergeMap, startWith, take, takeUntil, tap } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';

import {
  TableHeaderConfig,
  TableCellConfig,
  ITableBodyConfig,
  ITableConfig,
} from 'src/app/common/models/table';
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
  private readonly changeConfig: EventEmitter<void>;
  private readonly config: ITableConfig;

  constructor(private translate: TranslateService) {
    super();
    this.changeConfig = new EventEmitter<void>();
    this.config = {
      headers: cloneDeep(displayedColumns),
      body: [],
    };

    this.translate.onLangChange.pipe(
      startWith({ lang: null }),
      mergeMap((event: LangChangeEvent) => (
        event.lang === null ? this.getTableTranslation() : of(this.convertTranslation(event))
      )),
      tap((data: Array<string>) => this.translateHeaders(data)),
      tap(() => this.changeConfig.emit()),
      takeUntil(this.unsubscribe$),
    ).subscribe();
  }

  private getTableTranslation(): Observable<Array<string>> {
    return this.translate.get('STUDENTS.TABLE').pipe(
      take(1),
    );
  }

  private convertTranslation({ translations }: LangChangeEvent): Array<string> {
    return translations.STUDENTS.TABLE;
  }

  private translateHeaders(headers: Array<string>): void {
    this.config.headers.forEach((item, index) => (
      item.content = headers[index]
    ));
  }

  public updateTableBody(students: Array<Student>): void {
    this.config.body = this.getTableBodyConfig(students);
    this.changeConfig.emit();
  }

  public getConfig(students: Array<Student>): Observable<ITableConfig> {
    this.updateTableBody(students);

    return this.changeConfig.pipe(
      startWith({}),
      map(() => (
        { ...this.config }
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
