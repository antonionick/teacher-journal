import { SubjectTableBodyService } from './';
import {
  IChangeField,
  TableCellConfig,
  ITableBodyConfig, TableHeaderConfig,
} from 'src/app/common/models/table';
import { Student } from 'src/app/common/models/student/student';
import { IMarksByDate, Mark } from 'src/app/common/models/mark';
import { DateChanges } from 'src/app/common/models/utils/date-changes';

describe('SubjectTableBodyService', () => {
  describe('getComputedAverageMark', () => {
    const service: SubjectTableBodyService = new SubjectTableBodyService();
    let field: ITableBodyConfig;
    let averageMark: string;

    beforeEach(() => {
      field = {
        1: new TableCellConfig({ value: `${ 5 }` }),
        2: new TableCellConfig({ value: `${ 3 }` }),
        3: new TableCellConfig({ value: `${ 7 }` }),
      };
      averageMark = '';
    });

    it('should compute average mark', () => {
      averageMark = service.getComputedAverageMark(field);

      expect(+averageMark).toBe(5);
    });

    it('should return empty string if field does not have marks', () => {
      field = {};
      averageMark = service.getComputedAverageMark(field);

      expect(averageMark).toBe('');
    });
  });

  describe('createBody', () => {
    const service: SubjectTableBodyService = new SubjectTableBodyService();
    let marks: IMarksByDate;
    let students: Array<Student>;
    let bodyConfig: Array<ITableBodyConfig>;

    beforeEach(() => {
      marks = {
        1587502800000: {
          1: {
            id: 1,
            studentId: 1,
            subjectId: 1,
            date: 1587502800000,
            value: 5,
          },
          2: {
            id: 6,
            studentId: 2,
            subjectId: 1,
            date: 1587502800000,
            value: 10,
          },
        },
        1587589200000: {
          1: {
            id: 2,
            studentId: 1,
            subjectId: 1,
            date: 1587589200000,
            value: 3,
          },
        },
        1588583309369: {
          2: {
            id: 7,
            studentId: 2,
            subjectId: 1,
            date: 1588583309369,
            value: 9,
          },
        },
      };
      students = [
        new Student({
          id: 1,
          name: 'Unknown1',
          lastName: 'Unknown1',
        }),
        new Student({
          id: 2,
          name: 'Unknown2',
          lastName: 'Unknown2',
        }),
      ];
      bodyConfig = [];
    });

    it('should return body config with all students', () => {
      bodyConfig = service.createBody(marks, students);

      expect(bodyConfig.length).toBe(students.length);
    });

    it(
      'should add student and their marks if id in student and studentId in mark are match',
      () => {
        const marksKeys: Array<string> = Object.keys(marks);
        bodyConfig = service.createBody(marks, students);

        bodyConfig.forEach((field) => {
          marksKeys.forEach((date) => {
            const mark: Mark = marks[date][field.id.value] || null;
            if (mark === null) {
              return;
            }

            expect(+field[date].value).toBe(mark.value);
          });
        });
      },
    );

    it('should compute average mark', () => {
      bodyConfig = service.createBody(marks, students);

      bodyConfig.forEach((field) => {
        expect(field['average mark'].value).toBe(service.getComputedAverageMark(field));
      });
    });
  });

  describe('updateBodyByDateChanges', () => {
    const service: SubjectTableBodyService = new SubjectTableBodyService();
    let marks: IMarksByDate;
    let students: Array<Student>;
    let dateChanges: DateChanges;
    let bodyConfig: Array<ITableBodyConfig>;

    beforeEach(() => {
      marks = {
        1587502800000: {
          1: {
            id: 1,
            studentId: 1,
            subjectId: 1,
            date: 1587502800000,
            value: 5,
          },
        },
      };
      students = [
        new Student({
          id: 1,
          name: 'Unknown1',
          lastName: 'Unknown1',
        }),
      ];
      bodyConfig = service.createBody(marks, students);
      dateChanges = new DateChanges({
        current: 1587589200000,
        previously: 1587502800000,
      });
    });

    it('should do nothing if current date is null', () => {
      dateChanges.current = null;
      service.updateBodyByDateChanges(bodyConfig, dateChanges);

      expect(!!bodyConfig[0][dateChanges.previously]).toBe(true);
      expect(bodyConfig[0][dateChanges.current]).toBe(undefined);
    });

    it('should replace mark from prev date to current date', () => {
      service.updateBodyByDateChanges(bodyConfig, dateChanges);

      expect(+bodyConfig[0][dateChanges.current].value).toBe(5);
    });

    it('should delete prev date', () => {
      service.updateBodyByDateChanges(bodyConfig, dateChanges);

      expect(bodyConfig[0][dateChanges.previously]).toBe(undefined);
    });

    it('should create current date', () => {
      service.updateBodyByDateChanges(bodyConfig, dateChanges);

      expect(bodyConfig[0][dateChanges.current]).not.toBe(undefined);
    });
  });

  describe('updateBodyByAddDates', () => {
    const service: SubjectTableBodyService = new SubjectTableBodyService();
    let marks: IMarksByDate;
    let students: Array<Student>;
    let addedHeader: TableHeaderConfig;
    let bodyConfig: Array<ITableBodyConfig>;

    beforeEach(() => {
      marks = {
        1587502800000: {
          1: {
            id: 1,
            studentId: 1,
            subjectId: 1,
            date: 1587502800000,
            value: 5,
          },
        },
      };
      students = [
        new Student({
          id: 1,
          name: 'Unknown1',
          lastName: 'Unknown1',
        }),
      ];
      bodyConfig = service.createBody(marks, students);
      addedHeader = new TableHeaderConfig({ title: `${ 1587589200000 }` });
    });

    it('should add to each field created date', () => {
      service.updateBodyByAddDates(bodyConfig, addedHeader);

      bodyConfig.forEach((field) => {
        expect(field[addedHeader.title]).not.toBe(undefined);
      });
    });
  });

  describe('updateMark', () => {
    const service: SubjectTableBodyService = new SubjectTableBodyService();
    let marks: IMarksByDate;
    let students: Array<Student>;
    let changeField: IChangeField<number>;
    let bodyConfig: Array<ITableBodyConfig>;

    beforeEach(() => {
      marks = {
        1587502800000: {
          1: {
            id: 1,
            studentId: 1,
            subjectId: 1,
            date: 1587502800000,
            value: 5,
          },
          2: {
            id: 2,
            studentId: 2,
            subjectId: 1,
            date: 1587502800000,
            value: 5,
          },
        },
      };
      students = [
        new Student({
          id: 1,
          name: 'Unknown1',
          lastName: 'Unknown1',
        }),
        new Student({
          id: 2,
          name: 'Unknown2',
          lastName: 'Unknown2',
        }),
      ];
      bodyConfig = service.createBody(marks, students);
      changeField = { value: 6, column: 1587502800000, row: 1 };
    });

    it('should update mark by changed value', () => {
      service.updateMark(bodyConfig, changeField);

      expect(+bodyConfig[0][changeField.column].value).toBe(changeField.value);
    });

    it('should update mark to empty string if mark deleted', () => {
      changeField.value = -1;
      service.updateMark(bodyConfig, changeField);

      expect(bodyConfig[0][changeField.column].value).toBe('');
    });

    it('should update mark only if student id is match', () => {
      service.updateMark(bodyConfig, changeField);

      expect(+bodyConfig[0][changeField.column].value).toBe(changeField.value);
      expect(+bodyConfig[1][changeField.column].value).not.toBe(changeField.value);
    });

    it('should update average mark by filed where mark changed', () => {
      marks[1587589200000] = {
        1: {
          id: 3,
          studentId: 1,
          subjectId: 1,
          date: 1587589200000,
          value: 3,
        },
        2: {
          id: 4,
          studentId: 2,
          subjectId: 1,
          date: 1587589200000,
          value: 7,
        },
      };

      bodyConfig = service.createBody(marks, students);
      const averageMarks: Array<string> = bodyConfig
        .map((field) => field['average mark'].value);

      service.updateMark(bodyConfig, changeField);

      expect(bodyConfig[0]['average mark'].value).not.toBe(averageMarks[0]);
      expect(bodyConfig[1]['average mark'].value).toBe(averageMarks[1]);
    });
  });

  describe('deleteMarkByDate', () => {
    const service: SubjectTableBodyService = new SubjectTableBodyService();
    let dateToDelete: number;
    let marks: IMarksByDate;
    let students: Array<Student>;
    let bodyConfig: Array<ITableBodyConfig>;

    beforeEach(() => {
      marks = {
        1587502800000: {
          1: {
            id: 1,
            studentId: 1,
            subjectId: 1,
            date: 1587502800000,
            value: 5,
          },
          2: {
            id: 2,
            studentId: 2,
            subjectId: 1,
            date: 1587502800000,
            value: 5,
          },
        },
        1587589200000: {
          1: {
            id: 3,
            studentId: 1,
            subjectId: 1,
            date: 1587589200000,
            value: 3,
          },
          2: {
            id: 4,
            studentId: 2,
            subjectId: 1,
            date: 1587589200000,
            value: 7,
          },
        },
      };
      students = [
        new Student({
          id: 1,
          name: 'Unknown1',
          lastName: 'Unknown1',
        }),
        new Student({
          id: 2,
          name: 'Unknown2',
          lastName: 'Unknown2',
        }),
      ];
      bodyConfig = service.createBody(marks, students);
      dateToDelete = 1587502800000;
    });

    it('should delete only if passed date and field date are match', () => {
      dateToDelete = 0;
      service.deleteMarkByDate(dateToDelete, bodyConfig);

      bodyConfig.forEach((field) => {
        expect(field[1587502800000]).not.toBe(undefined);
        expect(field[1587589200000]).not.toBe(undefined);
      });
    });

    it('should delete mark in each field by date', () => {
      service.deleteMarkByDate(dateToDelete, bodyConfig);

      bodyConfig.forEach((field) => {
        expect(field[dateToDelete]).toBe(undefined);
      });
    });

    it('should update average mark after delete ', () => {
      const averageMarks: Array<string> = bodyConfig
        .map((field) => field['average mark'].value);
      service.deleteMarkByDate(dateToDelete, bodyConfig);

      bodyConfig.forEach((field, index) => {
        expect(field['average mark'].value).not.toBe(averageMarks[index]);
      });
    });
  });

  describe('sortBody', () => {
    const sortFuncByName:
      (a: ITableBodyConfig, b: ITableBodyConfig) => number =
      (a, b) => {
        return a.name.value.localeCompare(b.name.value);
      };
    const service: SubjectTableBodyService = new SubjectTableBodyService();
    let marks: IMarksByDate;
    let students: Array<Student>;
    let bodyConfig: Array<ITableBodyConfig>;
    let sortedBody: Array<ITableBodyConfig>;
    let sortSpy: { sort: (a: ITableBodyConfig, b: ITableBodyConfig) => number };

    beforeEach(() => {
      marks = {
        1587502800000: {
          1: {
            id: 1,
            studentId: 1,
            subjectId: 1,
            date: 1587502800000,
            value: 5,
          },
          2: {
            id: 2,
            studentId: 2,
            subjectId: 1,
            date: 1587502800000,
            value: 5,
          },
        },
      };
      students = [
        new Student({
          id: 1,
          name: 'name',
          lastName: 'Unknown1',
        }),
        new Student({
          id: 2,
          name: 'a',
          lastName: 'Unknown2',
        }),
      ];
      bodyConfig = service.createBody(marks, students);
      sortedBody = [];
      sortSpy = { sort: sortFuncByName };
      spyOn(sortSpy, 'sort');
    });

    it('should return new body', () => {
      sortedBody = service.sortBody(bodyConfig);

      expect(sortedBody).not.toBe(bodyConfig);
    });

    it('should sort body by lastName by default', () => {
      const expectOrder: Array<string> = ['Unknown1', 'Unknown2'];
      sortedBody = service.sortBody(bodyConfig);

      sortedBody.forEach((field, index) => {
        expect(field.lastName.value).toBe(expectOrder[index]);
      });
    });

    it('should sort body in ascending order by default', () => {
      const exceptedOrderByName: Array<string> = ['a', 'name'];
      [bodyConfig[0].lastName.value, bodyConfig[1].lastName.value] =
        [bodyConfig[1].lastName.value, bodyConfig[0].lastName.value];

      sortedBody = service.sortBody(bodyConfig);

      sortedBody.forEach((field, index) => {
        expect(field.name.value).toBe(exceptedOrderByName[index]);
      });
    });

    it('should sort body by passed func if pass as second parameter', () => {
      sortedBody = service.sortBody(bodyConfig, sortSpy.sort);

      expect(sortSpy.sort).toHaveBeenCalled();
    });
  });
});
