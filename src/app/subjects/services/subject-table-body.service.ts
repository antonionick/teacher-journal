import { Injectable } from '@angular/core';

import { ICell, IChangeField } from 'src/app/common/models/table';
import { Student } from 'src/app/common/models/student';
import { Mark } from 'src/app/common/models/mark';
import { TNullable } from 'src/app/common/models/tnullable';
import { DateChanges } from 'src/app/common/models/date-changes';
import { findById } from 'src/app/common/helpers/utils';

@Injectable()
export class SubjectTableBodyService {
  private sortBodyFunc(a: ICell<string>, b: ICell<string>): number {
    return a.lastName.localeCompare(b.lastName);
  }

  private createBodyField(student: Student): TNullable<ICell<string>> {
    return {
      id: student.id.toString(),
      name: student.name,
      lastName: student.lastName,
      'average mark': '',
    };
  }

  private computeAverageMarkByField(field: ICell<string>): number {
    let count: number = 0;
    const sum: number = Object.keys(field).reduce((acc, key) => {
      return Number.isNaN(+key) ? acc : (count++, acc + +field[key]);
    }, 0);

    return count === 0 ? -1 : sum / count;
  }

  public getComputedAverageMark(field: ICell<string>): string {
    const mark: number = this.computeAverageMarkByField(field);
    return mark === -1 ? '' : `${mark}`;
  }

  public createBody(marks: Array<Mark>, students: Array<Student>): Array<ICell<string>> {
    return marks.reduce((body: Array<ICell<string>>, mark) => {
      let isCreated: boolean = false;
      let field: TNullable<ICell<string>> = findById<{ id: string }>(
        <Array<{ id: string }>>body,
        mark.studentId,
      );

      if (field === null) {
        const student: TNullable<Student> = findById<Student>(students, mark.studentId);
        if (student === null) {
          return;
        }

        field = this.createBodyField(student);
        isCreated = true;
      }

      field[mark.date] = `${mark.value}`;
      if (isCreated) {
        body.push(field);
      }

      return body;
    }, []);
  }

  public updateMarksByDate(
    body: Array<ICell<string>>,
    { current, previously: prev }: DateChanges,
  ): Array<ICell<string>> {
    return body.map((field) => {
      if (!field[prev]) {
        return field;
      }

      const item: ICell<string> = Object.assign({}, field);
      item[current] = item[prev];
      delete item[prev];
      return item;
    });
  }

  public updateMark(
    body: Array<ICell<string>>,
    { value: mark, column: date, row: rowIndex }: IChangeField<number>,
  ): Array<ICell<string>> {

    return body.map((item, index) => {
      if (index !== rowIndex) {
        return item;
      }

      if (mark !== -1) {
        item[date] = `${mark}`;
      } else {
        delete item[date];
      }
      item['average mark'] = this.getComputedAverageMark(item);

      return item;
    });
  }

  public deleteMarksByDate(milliseconds: number, body: Array<ICell<string>>): Array<ICell<string>> {
    return body.map((item) => {
      const newItem: ICell<string> = Object.assign({}, item);
      delete newItem[milliseconds];
      newItem['average mark'] = this.getComputedAverageMark(item);
      return newItem;
    });
  }

  public sortBody(
    body: Array<ICell<string>>,
    sort?: (a: ICell<string>, b: ICell<string>) => number,
  ): Array<ICell<string>> {
    if (body.length < 2) {
      return;
    }

    const result: Array<ICell<string>> = body.slice();
    if (!sort) {
      sort = this.sortBodyFunc;
    }

    return result.sort(sort);
  }
}
