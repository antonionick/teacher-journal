import { Injectable } from '@angular/core';
import { TableHeaderConfig, TableCellConfig, TableBodyConfig } from 'src/app/common/models/table';
import { Student } from 'src/app/common/models/student';

const displayedColumns: Array<TableHeaderConfig> = [
  new TableHeaderConfig({
    value: 'id',
    sort: true,
  }),
  new TableHeaderConfig({
    value: 'delete',
    isVisible: false,
  }),
  new TableHeaderConfig({
    value: 'name',
    sort: true,
  }),
  new TableHeaderConfig({
    value: 'lastName',
    sort: true,
  }),
  new TableHeaderConfig({
    value: 'address',
    sort: true,
  }),
  new TableHeaderConfig({
    value: 'description',
    sort: true,
  }),
];

@Injectable()
export class StudentTableService {
  public displayedColumns: Array<TableHeaderConfig>;

  constructor() {
    this.displayedColumns = displayedColumns;
  }

  public addDeleteButtonToStudentConfig(student: TableBodyConfig): void {
    student.delete = new TableCellConfig({ isExternal: true });
  }

  public getTableBodyConfig(students: Array<Student>): Array<TableBodyConfig> {
    if (students.length === 0) {
      return [];
    }

    const studentKeys: Array<string> = Object.keys(students[0]);

    return students.map((student) => {
      const studentConfig: TableBodyConfig = {};

      studentKeys.map((key) => {
        studentConfig[key] = new TableCellConfig({ value: student[key] });
      });
      this.addDeleteButtonToStudentConfig(studentConfig);

      return studentConfig;
    });
  }
}
