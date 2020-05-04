import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import {
  IChangeField,
  TableCellConfig,
  ITableBodyConfig, TableHeaderConfig,
} from 'src/app/common/models/table';
import { Student } from 'src/app/common/models/student/student';
import { IMarksByDate, Mark, EditMark, HighlightMark } from 'src/app/common/models/mark';
import { DateChanges } from 'src/app/common/models/utils/date-changes';

@Injectable()
export class SubjectTableBodyService {
  private readonly editMark: EditMark;

  constructor() {
    const editMarkClasses: Array<string> = ['edit-mark'];
    this.editMark = new EditMark({ inputClasses: editMarkClasses });
  }

  private sortBodyFunc(a: ITableBodyConfig, b: ITableBodyConfig): number {
    return a.lastName.value.localeCompare(b.lastName.value);
  }

  private createBodyField({ id, name, lastName }: Student): ITableBodyConfig {
    return {
      id: new TableCellConfig({ value: `${id}` }),
      name: new TableCellConfig({ value: name }),
      lastName: new TableCellConfig({ value: lastName }),
      'average mark': new TableCellConfig({
        pipe: new DecimalPipe('en-US'),
        pipeArgs: '1.0-1',
        highlight: new HighlightMark(),
      }),
    };
  }

  private computeAverageMark(field: ITableBodyConfig): number {
    let count: number = 0;

    const sum: number = Object.keys(field).reduce((acc, key) => {
      const isEditCell: boolean = !Number.isNaN(+key);

      if (isEditCell && field[key].value !== '') {
        count++;
        return acc + +field[key].value;
      }

      return acc;
    }, 0);

    return count === 0 ? -1 : sum / count;
  }

  private updateAverageMark(field: ITableBodyConfig, value: string): void {
    field['average mark'].value = value;
  }

  public getComputedAverageMark(field: ITableBodyConfig): string {
    const mark: number = this.computeAverageMark(field);
    return mark === -1 ? '' : `${mark}`;
  }

  public createBody(marks: IMarksByDate, students: Array<Student>): Array<ITableBodyConfig> {
    const body: Array<ITableBodyConfig> = students.reduce((arr, student) => {
      const field: ITableBodyConfig = this.createBodyField(student);
      arr.push(field);
      return arr;
    }, []);

    Object.keys(marks).forEach((date) => {
      body.forEach((field) => {
        const mark: Mark = marks[date][field.id.value] || null;

        if (mark === null) {
          return field[date] = new TableCellConfig({ editCell: this.editMark });
        }

        field[date] = new TableCellConfig({ value: `${mark.value}`, editCell: this.editMark });
      });
    });

    body.forEach((item) => {
      this.updateAverageMark(item, this.getComputedAverageMark(item));
    });

    return body;
  }

  public updateBodyByDateChanges(
    body: Array<ITableBodyConfig>,
    { current, previously: prev }: DateChanges,
  ): Array<ITableBodyConfig> {
    if (current === null) {
      return body;
    }

    body.forEach((field) => {
      if (!field[prev]) {
        return field;
      }

      field[current] = field[prev];
      delete field[prev];
    });

    return body;
  }

  public updateBodyByAddDates(
    body: Array<ITableBodyConfig>,
    { value: milliseconds }: TableHeaderConfig,
  ): Array<ITableBodyConfig> {
    body.forEach((field) => {
      field[milliseconds] = new TableCellConfig({ editCell: this.editMark });
    });

    return body;
  }

  public updateMark(
    body: Array<ITableBodyConfig>,
    { value: mark, column: date, row: id }: IChangeField<number>,
  ): Array<ITableBodyConfig> {
    body.forEach((item) => {
      if (+item.id.value !== id) {
        return item;
      }

      if (mark !== -1) {
        item[date].value = `${mark}`;
      } else {
        item[date].value = '';
      }

      this.updateAverageMark(item, this.getComputedAverageMark(item));
    });

    return body;
  }

  public deleteMarkByDate(
    milliseconds: number,
    body: Array<ITableBodyConfig>,
  ): Array<ITableBodyConfig> {
    body.forEach((item) => {
      delete item[milliseconds];
      this.updateAverageMark(item, this.getComputedAverageMark(item));
    });

    return body;
  }

  public sortBody(
    body: Array<ITableBodyConfig>,
    sort?: (a: ITableBodyConfig, b: ITableBodyConfig) => number,
  ): Array<ITableBodyConfig> {
    if (body.length < 2) {
      return body;
    }

    const result: Array<ITableBodyConfig> = body.slice();
    if (!sort) {
      sort = this.sortBodyFunc;
    }

    return result.sort(sort);
  }
}
