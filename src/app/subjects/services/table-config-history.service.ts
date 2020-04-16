import { Injectable } from '@angular/core';

import { convert } from '../utils/convert-history-change';
import { DateChanges, IDataChanges } from '../../common/models/utils';
import { TableConfigHistory } from '../../common/models/table/table-config-history';
import { Mark, MarkHistory, IMarksByDate } from '../../common/models/mark';
import { IChangeField } from '../../common/models/table';
import { TNullable } from 'src/app/common/models/utils/tnullable';

@Injectable()
export class TableConfigHistoryService {
  private historyChanges: Array<TableConfigHistory> = [];

  private findItemByCurrent(current: number): TNullable<TableConfigHistory> {
    return this.historyChanges.find((item) => item.current === current) || null;
  }

  private findHistoryMark(item: TableConfigHistory, studentId: number): TNullable<MarkHistory> {
    return item.marks.find((mark) => mark.studentId === studentId) || null;
  }

  private createHistoryItem(
    source: number,
    current: TNullable<number> = source,
  ): TableConfigHistory {
    return new TableConfigHistory({ source, current });
  }

  public updateDate({ previously: prev, current }: DateChanges): void {
    let item: TableConfigHistory = this.findItemByCurrent(prev);

    if (item === null) {
      item = this.createHistoryItem(prev, current);
      this.historyChanges.push(item);
    } else {
      item.current = current;
    }
  }

  public deleteDate(milliseconds: number): void {
    let item: TableConfigHistory = this.findItemByCurrent(milliseconds);

    if (item === null) {
      item = this.createHistoryItem(milliseconds);
      this.historyChanges.push(item);
    }

    item.isDeleted = true;
  }

  public updateMark({ column: date, row: studentId, value }: IChangeField<number>): void {
    let item: TableConfigHistory = this.findItemByCurrent(date);
    let created: boolean = false;

    if (item === null) {
      item = this.createHistoryItem(date);
      created = true;
    }

    let mark: MarkHistory = this.findHistoryMark(item, studentId);
    if (mark === null) {
      mark = new MarkHistory({ studentId, value });
      item.marks.push(mark);
    } else {
      mark.value = value;
    }
    mark.isDeleted = value === -1;

    if (created) {
      this.historyChanges.push(item);
    }
  }

  public resetHistoryChanges(): void {
    this.historyChanges = [];
  }

  public getChanges(marks: IMarksByDate, subjectId: number): IDataChanges<Mark> {
    return convert(this.historyChanges, marks, subjectId);
  }
}
