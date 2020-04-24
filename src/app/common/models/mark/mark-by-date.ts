import { Mark } from './mark';

export interface IMarksByDate {
  [milliseconds: string]: {
    [studentId: string]: Mark;
  };
}
