import { HttpClient } from '@angular/common/http';

import { MarkService } from './mark.service';
import { Subject } from '../models/subject';
import { Mark } from '../models/mark';
import { initialStateMarks, IMarksState } from '../../@ngrx/marks';
import { initialState, ISubjectState } from '../../@ngrx/subjects';

describe('MarkService', () => {
  describe('isAllMarksLoaded', () => {
    let service: MarkService;

    beforeEach(() => {
      service = new MarkService({} as HttpClient);
    });

    it('should return false if subjects did not load', () => {
      const marks: IMarksState = { ...initialStateMarks };
      const subjects: ISubjectState = { ...initialState };

      expect(service.isAllMarksLoaded(marks, subjects)).toBe(false);
    });

    it('should return false if subjects exist but loaded is false', () => {
      const marks: IMarksState = { ...initialStateMarks };
      const subjects: ISubjectState = {
        ...initialState,
        subjects: [new Subject({ id: 1 })],
      };

      expect(service.isAllMarksLoaded(marks, subjects)).toBe(false);
    });

    it('should return false if not all marks by subjects loaded', () => {
      const marks: IMarksState = { ...initialStateMarks };
      const subjects: ISubjectState = {
        ...initialState,
        loaded: true,
        subjects: [new Subject({ id: 1 })],
      };

      expect(service.isAllMarksLoaded(marks, subjects)).toBe(false);
    });

    it('should return false if marks by subject is not array', () => {
      const marks: IMarksState = { ...initialStateMarks, marks: { 1: null } };
      const subjects: ISubjectState = {
        ...initialState,
        loaded: true,
        subjects: [new Subject({ id: 1 })],
      };

      expect(service.isAllMarksLoaded(marks, subjects)).toBe(false);
    });

    it('should return false if not all marks loaded', () => {
      const marks: IMarksState = { ...initialStateMarks, marks: { 1: [] } };
      const subjects: ISubjectState = {
        ...initialState,
        loaded: true,
        subjects: [new Subject({ id: 1 }), new Subject({ id: 2 })],
      };

      expect(service.isAllMarksLoaded(marks, subjects)).toBe(false);
    });

    it('should return true if all marks and subjects loaded', () => {
      const marks: IMarksState = { ...initialStateMarks, marks: { 1: [], 2: [] } };
      const subjects: ISubjectState = {
        ...initialState,
        loaded: true,
        subjects: [new Subject({ id: 1 }), new Subject({ id: 2 })],
      };

      expect(service.isAllMarksLoaded(marks, subjects)).toBe(true);
    });
  });

  describe('getMarksByKey', () => {
    let service: MarkService;

    beforeEach(() => {
      service = new MarkService({} as HttpClient);
    });

    it('should return array', () => {
      const marks: IMarksState = { ...initialStateMarks };
      expect(service.getMarksByKey('id', '1', marks)).toEqual([]);
    });

    it('should return empty array if marks do not match with value', () => {
      const marks: IMarksState = {
        ...initialStateMarks,
        marks: { 1: [new Mark({ id: 1 }), new Mark({ id: 2 }), new Mark({ id: 4 })] },
      };

      expect(service.getMarksByKey('id', 3, marks)).toEqual([]);
    });

    it('should return not empty array from different fields', () => {
      const marks: IMarksState = {
        ...initialStateMarks,
        marks: {
          1: [new Mark({ id: 3, date: 1 }), new Mark({ id: 4, date: 1 })],
          2: [new Mark({ id: 3, date: 1 })],
          3: [new Mark({ id: 2, date: 1 }), new Mark({ id: 3, date: 1 })],
        },
      };

      expect(service.getMarksByKey('id', 3, marks)).toEqual([
        new Mark({ id: 3, date: 1 }),
        new Mark({ id: 3, date: 1 }),
        new Mark({ id: 3, date: 1 }),
      ]);
    });

    describe('should work with different key', () => {
      it('key is id', () => {
        const marks: IMarksState = {
          ...initialStateMarks,
          marks: {
            1: [new Mark({ id: 3, date: 1 })],
          },
        };

        expect(service.getMarksByKey('id', 3, marks))
          .toEqual([new Mark({ id: 3, date: 1 })]);
      });

      it('key is studentId', () => {
        const marks: IMarksState = {
          ...initialStateMarks,
          marks: {
            1: [new Mark({ studentId: 3, date: 1 })],
          },
        };

        expect(service.getMarksByKey('studentId', 3, marks))
          .toEqual([
            new Mark({ studentId: 3, date: 1 }),
          ]);
      });

      it('key is subjectId', () => {
        const marks: IMarksState = {
          ...initialStateMarks,
          marks: { 1: [new Mark({ subjectId: 3, date: 1 })] },
        };

        expect(service.getMarksByKey('subjectId', 3, marks))
          .toEqual([new Mark({ subjectId: 3, date: 1 })]);
      });
    });
  });
});
