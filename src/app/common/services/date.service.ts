import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  public resetDate(date: Date): void {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
  }

  public getNextDay(milliseconds: number): Date {
    const dayMilliseconds: number = 86400000;
    const nextDay: Date = new Date(milliseconds + dayMilliseconds);
    this.resetDate(nextDay);
    return nextDay;
  }

  public getPrevDay(milliseconds: number): Date {
    const dayMilliseconds: number = 86400000;
    const prevDay: Date = new Date(milliseconds - dayMilliseconds);
    this.resetDate(prevDay);
    return prevDay;
  }

  public compareDates(a: Date, b: Date): boolean {
    return a.getTime() === b.getTime();
  }
}
