import { Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { Observable, of } from 'rxjs';
import { map, mergeMap, startWith, take, tap } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';

import { TableHeaderConfig, TableCellConfig, ITableBodyConfig } from 'src/app/common/models/table';
import { Student } from 'src/app/common/models/student';

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
export class StudentTableService {
  private readonly displayedColumns: Array<TableHeaderConfig>;

  public get headers(): Observable<Array<TableHeaderConfig>> {
    return this.translate.onLangChange.pipe(
      startWith({ lang: null }),
      mergeMap((event: LangChangeEvent) => (
        event.lang === null ? this.getTableTranslation() : of(this.convertTranslation(event))
      )),
      tap((data: Array<string>) => this.translateDisplayedColumns(data)),
      map(() => this.displayedColumns),
    );
  }

  constructor(private translate: TranslateService) {
    this.displayedColumns = cloneDeep(displayedColumns);
  }

  private getTableTranslation(): Observable<Array<string>> {
    return this.translate.get('STUDENTS.TABLE').pipe(
      take(1),
    );
  }

  private convertTranslation({ translations }: LangChangeEvent): Array<string> {
    return translations.STUDENTS.TABLE;
  }

  private translateDisplayedColumns(headers: Array<string>): void {
    this.displayedColumns.forEach((item, index) =>
      item.content = headers[index],
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
