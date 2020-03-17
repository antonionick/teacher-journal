import { Injectable } from '@angular/core';

import { ICell } from 'src/app/common/models/Table';
import { Student } from 'src/app/common/models/Student';
import { Mark } from 'src/app/common/models/Mark';
import { TNullable } from 'src/app/common/models/TNullable';
import { DateChanges } from 'src/app/common/models/Date-changes';

@Injectable()
export class SubjectTableBodyService {
  private sortBodyFunc(a: ICell<string>, b: ICell<string>): number {
    return a.lastName.localeCompare(b.lastName);
  }

  private createBodyField(student: Student): TNullable<ICell<string>> {
    return student === null
      ? null
      : {
        id: student.id.toString(),
        name: student.name,
        lastName: student.lastName,
        'average mark': '',
      };
  }

  private findBodyFieldByMark(body: Array<ICell<string>>, mark: Mark): TNullable<ICell<string>> {
    for (let i: number = 0; i < body.length; i++) {
      if (+body[i].id === mark.studentId) {
        return body[i];
      }
    }

    return null;
  }

  private getStudentByMark(students: Array<Student>, mark: Mark): TNullable<Student> {
    for (let i: number = 0; i < students.length; i++) {
      if (students[i].id === mark.studentId) {
        return students[i];
      }
    }

    return null;
  }

  private computeAverageMarkByField(field: ICell<string>): number {
    let count: number = 0;
    const sum: number = Object.keys(field).reduce((acc, key) => {
      return Number.isNaN(+key) ? acc : (count++, acc + +field[key]);
    }, 0);

    return count === 0 ? 0 : sum / count;
  }

  public createBody(marks: Array<Mark>, students: Array<Student>): Array<ICell<string>> {
    const body: Array<ICell<string>> = [];

    marks.forEach((mark) => {
      let field: TNullable<ICell<string>> = this.findBodyFieldByMark(body, mark);
      let isNeedAdd: boolean = false;

      if (field === null) {
        const student: TNullable<Student> = this.getStudentByMark(students, mark);
        field = this.createBodyField(student);
        isNeedAdd = true;
      }
      if (field === null) {
        return;
      }

      field[mark.date] = mark.value.toString();
      if (isNeedAdd) {
        body.push(field);
      }
    });

    return body;
  }

  public updateMarksByDate(body: Array<ICell<string>>, changes: DateChanges): Array<ICell<string>> {
    if (changes.current === null) {
      return body;
    }
    const { current, previously: prev } = changes;

    return body.map((field) => {
      if (!field[prev]) {
        return field;
      }

      const item: ICell<string> = Object.assign({}, field);
      const mark: string = item[prev];
      delete item[prev];
      item[current] = mark;
    });
  }

  public deleteMark(milliseconds: number, body: Array<ICell<string>>): Array<ICell<string>> {
    const newBody: Array<ICell<string>> = body.map((item) => {
      const newItem: ICell<string> = Object.assign({}, item);
      delete newItem[milliseconds];
      return newItem;
    });

    this.computeAverageMarkByBody(newBody);
    return newBody;
  }

  public computeAverageMarkByBody(body: Array<ICell<string>>): void {
    body.forEach((item) => {
      const averageMark: number = this.computeAverageMarkByField(item);
      if (averageMark === 0) {
        return item['average mark'] = '';
      }

      item['average mark'] = averageMark.toString();
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
