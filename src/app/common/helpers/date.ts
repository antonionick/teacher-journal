function resetDate(date: Date): void {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
}

function getNextDay(milliseconds: number): Date {
  const dayMilliseconds: number = 86400000;
  const nextDay: Date = new Date(milliseconds + dayMilliseconds);
  resetDate(nextDay);
  return nextDay;
}

function getPrevDay(milliseconds: number): Date {
  const dayMilliseconds: number = 86400000;
  const prevDay: Date = new Date(milliseconds - dayMilliseconds);
  resetDate(prevDay);
  return prevDay;
}

function compareDates(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}

function getClosestEmptyDate<T extends { value: string }>(date: Date, headers: Array<T>): Date {
  let emptyDate: Date = new Date(date.getTime());

  headers.every((item) => {
    const milliseconds: number = +item.value;
    if (milliseconds > emptyDate.getTime()) {
      return false;
    }

    if (milliseconds === emptyDate.getTime()) {
      emptyDate = getNextDay(emptyDate.getTime());
    }

    return true;
  });

  return emptyDate;
}

export { resetDate, getNextDay, getPrevDay, compareDates, getClosestEmptyDate };
