import { Injectable } from '@angular/core';

import { ICell, IChangeField } from 'src/app/common/models/table';
import { Student } from 'src/app/common/models/student';
import { IMarksByDate, Mark } from 'src/app/common/models/mark';
import { TNullable } from 'src/app/common/models/useful/tnullable';
import { DateChanges } from 'src/app/common/models/useful/date-changes';

@Injectable()
export class SubjectTableBodyService {
  private sortBodyFunc(a: ICell<string>, b: ICell<string>): number {
    return a.lastName.localeCompare(b.lastName);
  }

  private createBodyField(student: Student): TNullable<ICell<string>> {
    return {
      id: `${student.id}`,
      name: student.name,
      lastName: student.lastName,
      'average mark': '',
    };
  }

  private computeAverageMark(field: ICell<string>): number {
    let count: number = 0;
    const sum: number = Object.keys(field).reduce((acc, key) => {
      return Number.isNaN(+key) ? acc : (count++, acc + +field[key]);
    }, 0);

    return count === 0 ? -1 : sum / count;
  }

  private updateAverageMark(field: ICell<string>, value: string): void {
    field['average mark'] = value;
  }

  public getComputedAverageMark(field: ICell<string>): string {
    const mark: number = this.computeAverageMark(field);
    return mark === -1 ? '' : `${mark}`;
  }

  public createBody(marks: IMarksByDate, students: Array<Student>): Array<ICell<string>> {
    const body: Array<ICell<string>> = students.reduce((arr, student) => {
      const field: ICell<string> = this.createBodyField(student);
      arr.push(field);
      return arr;
    }, []);

    Object.keys(marks).forEach((date) => {
      body.forEach((field) => {
        const mark: TNullable<Mark> = marks[date][field.id] || null;

        if (mark === null) {
          return;
        }

        field[date] = `${mark.value}`;
      });
    });

    body.forEach((item) => {
      this.updateAverageMark(item, this.getComputedAverageMark(item));
    });

    return body;
  }

  public updateBodyByDateChanges(
    body: Array<ICell<string>>,
    { current, previously: prev }: DateChanges,
  ): Array<ICell<string>> {
    if (current === null) {
      return body;
    }

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
    { value: mark, column: date, row: id }: IChangeField<number>,
  ): Array<ICell<string>> {
    return body.map((item) => {
      if (+item.id !== id) {
        return item;
      }

      if (mark !== -1) {
        item[date] = `${mark}`;
      } else {
        delete item[date];
      }
      this.updateAverageMark(item, this.getComputedAverageMark(item));

      return item;
    });
  }

  public deleteMarkByDate(milliseconds: number, body: Array<ICell<string>>): Array<ICell<string>> {
    return body.map((item) => {
      const newItem: ICell<string> = Object.assign({}, item);
      delete newItem[milliseconds];
      this.updateAverageMark(newItem, this.getComputedAverageMark(newItem));
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
