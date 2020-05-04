const dayMilliseconds: number = 86400000;

function startOfDay(date: Date): Date {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

function getEmptyDate(milliseconds: number): Date {
  const date: Date = new Date(milliseconds);
  return startOfDay(date);
}

function getNextDay(milliseconds: number): Date {
  const nextDay: Date = new Date(milliseconds + dayMilliseconds);
  return startOfDay(nextDay);
}

function getPrevDay(milliseconds: number): Date {
  const prevDay: Date = new Date(milliseconds - dayMilliseconds);
  return startOfDay(prevDay);
}

function getClosestEmptyDate<T extends { value: string }>(date: Date, dates: Array<T>): Date {
  let emptyDate: Date = new Date(date.getTime());

  dates.every((item) => {
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

export { startOfDay, getNextDay, getPrevDay, getClosestEmptyDate, getEmptyDate };
