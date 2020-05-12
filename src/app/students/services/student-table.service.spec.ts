import { EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Observable, of } from 'rxjs';

import { StudentTableService } from './student-table.service';
import { ITableBodyConfig, TableCellConfig } from 'src/app/common/models/table';
import { Student } from 'src/app/common/models/student';

const tableHeaders: Array<string> = ['id', 'delete', 'name', 'lastName', 'address', 'description'];

const translate: TranslateService = {
  onLangChange: new EventEmitter,
  get(key: string): Observable<Array<string>> {
    return of(tableHeaders);
  },
} as TranslateService;

describe('StudentTableService', () => {
  describe('addDeleteButtonToStudentConfig', () => {
    let service: StudentTableService;
    let bodyConfig: ITableBodyConfig;

    beforeEach(() => {
      service = new StudentTableService(translate);
      bodyConfig = {};
    });

    it('should add a delete button to student config', () => {
      service.addDeleteButtonToStudentConfig(bodyConfig);

      expect(bodyConfig.delete).toEqual(new TableCellConfig({ isExternal: true }));
    });
  });

  describe('getTableBodyConfig', () => {
    let service: StudentTableService;
    let students: Array<Student>;
    let bodyConfigs: Array<ITableBodyConfig>;

    beforeEach(() => {
      service = new StudentTableService(translate);
      students = [];
      bodyConfigs = [];
    });

    it('should return empty array if students.length is 0', () => {
      bodyConfigs = service.getTableBodyConfig(students);

      expect(bodyConfigs).toEqual([]);
    });

    it('should add to each bodyConfig delete button', () => {
      students = [new Student(), new Student()];
      bodyConfigs = service.getTableBodyConfig(students);

      bodyConfigs.forEach((config) => {
        expect(config.delete).toEqual(new TableCellConfig({ isExternal: true }));
      });
    });

    it('should return bodyConfig items with length of keys equal '
      + 'length of Student keys + 1 because add a delete button', () => {
      students = [new Student()];
      bodyConfigs = service.getTableBodyConfig(students);

      const bodyConfigLength: number = Object.keys(bodyConfigs[0]).length;
      const studentLength: number = Object.keys(students[0]).length;

      expect(studentLength + 1).toBe(bodyConfigLength);
    });

    it('should return bodyConfig items where keys is Student keys', () => {
      students = [new Student()];
      bodyConfigs = service.getTableBodyConfig(students);

      const bodyKeys: Array<string> = Object.keys(bodyConfigs[0]);
      const studentKeys: Array<string> = Object.keys(students[0]);

      studentKeys.forEach((key) => {
        expect(true).toBe(bodyKeys.includes(key));
      });
    });

    it('should length of bodyConfigs be equal of length of Students array', () => {
      students = [new Student(), new Student(), new Student(), new Student()];
      bodyConfigs = service.getTableBodyConfig(students);

      expect(students.length).toBe(bodyConfigs.length);
    });
  });
});
