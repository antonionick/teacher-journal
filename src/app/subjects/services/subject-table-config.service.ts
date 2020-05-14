import { EventEmitter, Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { Observable, of } from 'rxjs';
import { map, mergeMap, startWith, take, takeUntil, tap } from 'rxjs/operators';

import cloneDeep from 'lodash/cloneDeep';

import {
  TableHeaderConfig,
  ITableConfig,
  IChangeField,
  ITableBodyConfig,
} from '../../common/models/table';
import { Mark, EditMark, IMarksByDate } from '../../common/models/mark';
import { Student } from '../../common/models/student';
import { SubjectTableHeaderService } from './subject-table-header.service';
import { SubjectTableBodyService } from './subject-table-body.service';
import { TableConfigHistoryService } from './table-config-history.service';
import { IDataChanges } from '../../common/models/utils';
import { DateChanges } from 'src/app/common/models/utils/date-changes';
import { BaseComponent } from '../../components';

const headerConfig: Array<TableHeaderConfig> = [
  new TableHeaderConfig({
    title: 'name',
  }),
  new TableHeaderConfig({
    title: 'lastName',
    sticky: true,
  }),
  new TableHeaderConfig({
    title: 'average mark',
    sort: true,
    isAscSortStart: false,
  }),
];

@Injectable()
export class SubjectTableConfigService extends BaseComponent {
  private readonly editConfig: EditMark;
  private readonly headerConfig: Array<TableHeaderConfig>;
  private readonly config: ITableConfig;
  private changeConfig: EventEmitter<void>;
  private dateChanges: DateChanges;

  constructor(
    private headerService: SubjectTableHeaderService,
    private bodyService: SubjectTableBodyService,
    private configHistory: TableConfigHistoryService,
    private translate: TranslateService,
  ) {
    super();
    this.changeConfig = new EventEmitter<void>();
    this.editConfig = new EditMark();
    this.headerConfig = cloneDeep(headerConfig);
    this.config = {
      headers: [],
      body: [],
    };

    this.translate.onLangChange.pipe(
      startWith({ lang: null }),
      mergeMap((event: LangChangeEvent) => (
        event.lang === null ? this.getTableTranslation() : of(this.convertTranslation(event))
      )),
      tap((data) => {
        this.translateHeaders(data);
        this.changeConfig.emit();
      }),
      takeUntil(this.unsubscribe$),
    ).subscribe();
  }

  private getTableTranslation(): Observable<Array<string>> {
    return this.translate.get('SUBJECTS.TABLE.HEADERS').pipe(
      take(1),
    );
  }

  private convertTranslation({ translations }: LangChangeEvent): Array<string> {
    return translations.SUBJECTS.TABLE.HEADERS;
  }

  private translateHeaders(headers: Array<string>): void {
    headers.forEach((header, index) => (
      this.headerConfig[index].content = header
    ));
  }

  private createHeaders(marks: IMarksByDate): Array<TableHeaderConfig> {
    let dateHeaders: Array<TableHeaderConfig> = this.headerService.createDateHeaders(marks);
    dateHeaders = this.headerService.sortDateHeaders(dateHeaders);
    dateHeaders = this.headerService.setRangeDateHeaders(dateHeaders);
    return [...this.headerConfig, ...dateHeaders];
  }

  private updateHeaders(): Array<TableHeaderConfig> {
    let dateHeaders: Array<TableHeaderConfig> = this.config.headers.slice(this.headerConfig.length);
    this.dateChanges = this.headerService.updateDateByChanges(dateHeaders);
    dateHeaders = this.headerService.setRangeDateHeaders(dateHeaders);
    return [...this.headerConfig, ...dateHeaders];
  }

  private createBody(
    marks: IMarksByDate,
    students: Array<Student>,
  ): Array<ITableBodyConfig> {
    let body: Array<ITableBodyConfig> = this.bodyService.createBody(marks, students);
    body = this.bodyService.sortBody(body);
    return body;
  }

  private createConfig(students: Array<Student>, marks: IMarksByDate): void {
    this.config.headers = this.createHeaders(marks);
    this.config.body = this.createBody(marks, students);
  }

  public getConfig(students: Array<Student>, marks: IMarksByDate): Observable<ITableConfig> {
    this.createConfig(students, marks);

    return this.changeConfig.pipe(
      startWith({}),
      map(() => (
        { ...this.config }
      )),
    );
  }

  public updateConfig(students: Array<Student>, marks: IMarksByDate): void {
    this.createConfig(students, marks);
    this.changeConfig.emit();
  }

  public updateConfigByDateChanges(): void {
    this.config.headers = this.updateHeaders();
    this.config.body = this.bodyService.updateBodyByDateChanges(this.config.body, this.dateChanges);
    this.configHistory.updateDate(this.dateChanges);
    this.changeConfig.emit();
  }

  public addHeader(): void {
    let dateHeaders: Array<TableHeaderConfig> = this.config.headers.slice(this.headerConfig.length);
    const newDateHeader: TableHeaderConfig = this.headerService.addDateHeader(dateHeaders);
    dateHeaders.push(newDateHeader);
    dateHeaders = this.headerService.sortDateHeaders(dateHeaders);
    dateHeaders = this.headerService.setRangeDateHeaders(dateHeaders);
    this.config.headers = [...this.headerConfig, ...dateHeaders];
    this.config.body = this.bodyService.updateBodyByAddDates(this.config.body, newDateHeader);
    this.changeConfig.emit();
  }

  public deleteHeader({ title: date }: TableHeaderConfig): void {
    this.config.headers = this.headerService.deleteDateHeader(+date, this.config.headers);
    this.config.body = this.bodyService.deleteMarkByDate(+date, this.config.body);
    this.configHistory.deleteDate(+date);
    this.changeConfig.emit();
  }

  public updateMark(change: IChangeField<number>): void {
    this.config.body = this.bodyService.updateMark(this.config.body, change);
    this.configHistory.updateMark(change);
    this.changeConfig.emit();
  }

  public getChanges(marks: IMarksByDate, subjectId: number): IDataChanges<Mark> {
    const changes: IDataChanges<Mark> = this.configHistory.getChanges(marks, subjectId);
    this.configHistory.resetHistoryChanges();
    return changes;
  }
}
