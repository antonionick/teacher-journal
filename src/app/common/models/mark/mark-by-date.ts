import { Mark } from './mark';

export interface IMarksByDate {
  [key: string]: {
    [key: string]: Mark;
  };
}
