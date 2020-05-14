import { FormControl } from '@angular/forms';

import { SubjectTableHeaderService } from './';
import { TableHeaderConfig } from 'src/app/common/models/table';
import { IMarksByDate } from 'src/app/common/models/mark';
import { startOfDay, getNextDay, getEmptyDate, getPrevDay } from 'src/app/common/utils/date';
import { DateChanges } from 'src/app/common/models/utils';

describe('SubjectTableHeaderService', () => {
  describe('createDateHeaders', () => {
    const service: SubjectTableHeaderService = new SubjectTableHeaderService();
    let marksDate: Array<string>;
    let marks: IMarksByDate;
    let headers: Array<TableHeaderConfig>;

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
          6: {
            id: 6,
            studentId: 1,
            subjectId: 2,
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
          7: {
            id: 7,
            studentId: 1,
            subjectId: 2,
            date: 1588583309369,
            value: 9,
          },
        },
      };
      headers = [];

      if (marksDate == null) {
        marksDate = Object.keys(marks);
      }
    });

    it('should return empty array if marks are empty', () => {
      marks = {};
      headers = service.createDateHeaders(marks);

      expect(headers).toEqual([]);
    });

    it('should return length of headers equal date marks', () => {
      headers = service.createDateHeaders(marks);

      expect(headers.length).toBe(marksDate.length);
    });

    it('should return headers with date by marks', () => {
      headers = service.createDateHeaders(marks);

      headers.forEach((item) => {
        expect(marksDate.includes(item.title)).toBe(true);
      });
    });

    it(
      'should return headers with ' +
      'datePiker, sort and hoverContent property as true',
      () => {
        headers = service.createDateHeaders(marks);

        expect(headers[0].datePicker).toBe(true);
        expect(headers[0].sort).toBe(true);
        expect(headers[0].hoverContent).toBe(true);
      },
    );
  });

  describe('addDateHeader', () => {
    const dates: Array<number> = [
      new Date(1587502800000).getTime(),
      new Date(1587589200000).getTime(),
    ];
    const service: SubjectTableHeaderService = new SubjectTableHeaderService();
    let headers: Array<TableHeaderConfig>;
    let createdHeader: TableHeaderConfig;

    beforeEach(() => {
      headers = [
        new TableHeaderConfig({
          title: `${dates[0]}`,
          datePicker: true,
          inputControl: new FormControl({ value: dates[0], disabled: true }),
          sort: true,
          isAscSortStart: false,
          hoverContent: true,
        }),
        new TableHeaderConfig({
          title: `${dates[1]}`,
          datePicker: true,
          inputControl: new FormControl({ value: dates[1], disabled: true }),
          sort: true,
          isAscSortStart: false,
          hoverContent: true,
        }),
      ];
      createdHeader = {} as TableHeaderConfig;
    });

    it('should return header with today date if headers array does not contain today date', () => {
      const todayDate: number = startOfDay(new Date()).getTime();
      createdHeader = service.addDateHeader(headers);

      expect(createdHeader.title).toBe(`${todayDate}`);
    });

    it(
      'should return header with do not occupied date near of today date ' +
      'if headers array contains today date',
      () => {
        const occupiedDates: Array<number> = [
          getEmptyDate(Date.now()).getTime(),
          getNextDay(Date.now()).getTime(),
        ];
        const targetDate: Date = getNextDay(getNextDay(Date.now()).getTime());

        headers.push(
          new TableHeaderConfig({
            title: `${occupiedDates[0]}`,
            datePicker: true,
            inputControl: new FormControl({ value: occupiedDates[0], disabled: true }),
            sort: true,
            isAscSortStart: false,
            hoverContent: true,
          }),
          new TableHeaderConfig({
            title: `${occupiedDates[1]}`,
            datePicker: true,
            inputControl: new FormControl({ value: occupiedDates[1], disabled: true }),
            sort: true,
            isAscSortStart: false,
            hoverContent: true,
          }),
        );
        createdHeader = service.addDateHeader(headers);

        expect(createdHeader.title).toBe(`${targetDate.getTime()}`);
      },
    );
  });

  describe('deleteDateHeader', () => {
    const dates: Array<number> = [
      new Date(1587502800000).getTime(),
      new Date(1587589200000).getTime(),
    ];
    const service: SubjectTableHeaderService = new SubjectTableHeaderService();
    let headers: Array<TableHeaderConfig>;
    let headersWithoutDeleted: Array<TableHeaderConfig>;

    beforeEach(() => {
      headers = [
        new TableHeaderConfig({
          title: `${dates[0]}`,
          datePicker: true,
          inputControl: new FormControl({ value: dates[0], disabled: true }),
          sort: true,
          isAscSortStart: false,
          hoverContent: true,
        }),
        new TableHeaderConfig({
          title: `${dates[1]}`,
          datePicker: true,
          inputControl: new FormControl({ value: dates[1], disabled: true }),
          sort: true,
          isAscSortStart: false,
          hoverContent: true,
        }),
      ];

      headersWithoutDeleted = [];
    });

    it('should return new array of headers', () => {
      headersWithoutDeleted = service.deleteDateHeader(0, headers);

      expect(headersWithoutDeleted).not.toBe(headers);
    });

    it('should not delete header if headers do not match with passed parameter', () => {
      headersWithoutDeleted = service.deleteDateHeader(0, headers);

      expect(headersWithoutDeleted).toEqual(headers);
    });

    it('should delete header which match with passed parameter', () => {
      headersWithoutDeleted = service.deleteDateHeader(1587502800000, headers);

      headersWithoutDeleted.forEach((header) => {
        expect(header.title).not.toBe('1587502800000');
      });
    });

    it('should return empty array if passed headers are empty', () => {
      headersWithoutDeleted = service.deleteDateHeader(1587502800000, []);

      expect(headersWithoutDeleted).toEqual([]);
    });
  });

  describe('updateDateByChanges', () => {
    const dates: Array<number> = [
      new Date(1587502800000).getTime(),
      new Date(1587589200000).getTime(),
    ];
    const dateForChange: number = getPrevDay(1587502800000).getTime();
    const service: SubjectTableHeaderService = new SubjectTableHeaderService();
    let headers: Array<TableHeaderConfig>;
    let dateChanges: DateChanges;

    beforeEach(() => {
      headers = [
        new TableHeaderConfig({
          title: `${dates[0]}`,
          datePicker: true,
          inputControl: new FormControl({ value: dateForChange, disabled: true }),
          sort: true,
          isAscSortStart: false,
          hoverContent: true,
        }),
        new TableHeaderConfig({
          title: `${dates[1]}`,
          datePicker: true,
          inputControl: new FormControl({ value: dates[1], disabled: true }),
          sort: true,
          isAscSortStart: false,
          hoverContent: true,
        }),
      ];

      dateChanges = {} as DateChanges;
    });

    it('should return DateChanges if header was change', () => {
      dateChanges = service.updateDateByChanges(headers);

      expect(dateChanges instanceof DateChanges).toBe(true);
    });

    it('should return null if header was not change', () => {
      headers[0].inputControl.setValue(dates[0]);
      dateChanges = service.updateDateByChanges(headers);

      expect(dateChanges).toBe(null);
    });

    it('should update changed value of header(take value from inputControl)', () => {
      service.updateDateByChanges(headers);

      expect(+headers[0].title).toBe(headers[0].inputControl.value);
    });

    it('should return DateChanges with correct data', () => {
      const previously: number = +headers[0].title;
      const current: number = dateForChange;
      dateChanges = service.updateDateByChanges(headers);

      expect(dateChanges.current).toBe(current);
      expect(dateChanges.previously).toBe(previously);
    });
  });

  describe('setRangeDateHeaders', () => {
    const dates: Array<number> = [
      new Date(1587502800000).getTime(),
      new Date(1587589200000).getTime(),
      new Date(1587762000000).getTime(),
    ];
    const service: SubjectTableHeaderService = new SubjectTableHeaderService();
    let headers: Array<TableHeaderConfig>;
    let rangedHeaders: Array<TableHeaderConfig>;

    beforeEach(() => {
      headers = [
        new TableHeaderConfig({
          title: `${dates[0]}`,
          datePicker: true,
          inputControl: new FormControl({ value: dates[0], disabled: true }),
          sort: true,
          isAscSortStart: false,
          hoverContent: true,
        }),
        new TableHeaderConfig({
          title: `${dates[1]}`,
          datePicker: true,
          inputControl: new FormControl({ value: dates[1], disabled: true }),
          sort: true,
          isAscSortStart: false,
          hoverContent: true,
        }),
        new TableHeaderConfig({
          title: `${dates[2]}`,
          datePicker: true,
          inputControl: new FormControl({ value: dates[2], disabled: true }),
          sort: true,
          isAscSortStart: false,
          hoverContent: true,
        }),
      ];

      rangedHeaders = [];
    });

    it('should return new array', () => {
      rangedHeaders = service.setRangeDateHeaders(headers);

      expect(rangedHeaders).not.toBe(headers);
    });

    it('should set first element min range as null', () => {
      rangedHeaders = service.setRangeDateHeaders(headers);

      expect(rangedHeaders[0].min).toBe(null);
    });

    it('should set last element max range as null', () => {
      rangedHeaders = service.setRangeDateHeaders(headers);

      expect(rangedHeaders[2].max).toBe(null);
    });

    it('should set min range as next day of prev header', () => {
      const prev: number = getNextDay(+headers[0].title).getTime();
      rangedHeaders = service.setRangeDateHeaders(headers);

      expect(rangedHeaders[1].min.getTime()).toBe(prev);
    });

    it('should set max range as prev day of next header', () => {
      const next: number = getPrevDay(+headers[2].title).getTime();
      rangedHeaders = service.setRangeDateHeaders(headers);

      expect(rangedHeaders[1].max.getTime()).toBe(next);
    });
  });

  describe('sortDateHeaders', () => {
    const dates: Array<number> = [
      new Date(1587762000000).getTime(),
      new Date(1587589200000).getTime(),
      new Date(1587502800000).getTime(),
    ];
    const sortFunc:
      (a: TableHeaderConfig, b: TableHeaderConfig) => number =
      (a, b) => {
        return +b.title - +a.title;
      };
    const service: SubjectTableHeaderService = new SubjectTableHeaderService();
    let headers: Array<TableHeaderConfig>;
    let sortedHeaders: Array<TableHeaderConfig>;
    let sortSpy: { sort: (a: TableHeaderConfig, b: TableHeaderConfig) => number };

    beforeEach(() => {
      headers = [
        new TableHeaderConfig({
          title: `${dates[0]}`,
          datePicker: true,
          inputControl: new FormControl({ value: dates[0], disabled: true }),
          sort: true,
          isAscSortStart: false,
          hoverContent: true,
        }),
        new TableHeaderConfig({
          title: `${dates[1]}`,
          datePicker: true,
          inputControl: new FormControl({ value: dates[1], disabled: true }),
          sort: true,
          isAscSortStart: false,
          hoverContent: true,
        }),
        new TableHeaderConfig({
          title: `${dates[2]}`,
          datePicker: true,
          inputControl: new FormControl({ value: dates[2], disabled: true }),
          sort: true,
          isAscSortStart: false,
          hoverContent: true,
        }),
      ];

      sortedHeaders = [];
      sortSpy = { sort: sortFunc };
      spyOn(sortSpy, 'sort');
    });

    it('should return new headers', () => {
      sortedHeaders = service.sortDateHeaders(headers);

      expect(sortedHeaders).not.toBe(headers);
    });

    it('should sort headers in ascending order by default', () => {
      sortedHeaders = service.sortDateHeaders(headers);
      let prev: number = 0;

      sortedHeaders.forEach((header) => {
        if (prev > 0) {
          expect(+header.title).toBeGreaterThan(prev);
        }

        prev = +header.title;
      });
    });

    it('should sort headers by passed func if pass as second parameter', () => {
      sortedHeaders = service.sortDateHeaders(headers, sortSpy.sort);

      expect(sortSpy.sort).toHaveBeenCalled();
    });
  });
});
