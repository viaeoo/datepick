export function getTime (date: Date|number): number {
  return new Date(date).setHours(0, 0, 0, 0);
}

export function today (): number {
  return new Date().getTime();
}

export function dateValue (year: number, month: number, day: number): number {
  const newDate = new Date();
  newDate.setFullYear(year, month, day);

  return newDate.setHours(0, 0, 0, 0);
}

export function addDays (date: Date|number, amount: number): number {
  const newDate = new Date(date);

  return newDate.setDate(newDate.getDate() + amount);
}

export function addWeeks (date: Date|number, amount: number): number {
  return addDays(date, amount * 7);
}

export function addMonths (date: Date|number, amount: number): number {
  const newDate = new Date(date);
  const monthsToSet = newDate.getMonth() + amount;
  let expectedMonth = monthsToSet % 12;

  if (expectedMonth < 0) {
    expectedMonth += 12;
  }

  const time = newDate.setMonth(monthsToSet);

  return newDate.getMonth() !== expectedMonth
    ? newDate.setDate(0)
    : time;
}

export function addYears (date: Date|number, amount: number): number {
  // If the date is Feb 29 and the new year is not a leap year, Feb 28 of the
  // new year will be returned.
  const newDate = new Date(date);
  const expectedMonth = newDate.getMonth();
  const time = newDate.setFullYear(newDate.getFullYear() + amount);

  return expectedMonth === 1 && newDate.getMonth() === 2
    ? newDate.setDate(0)
    : time;
}

function dayDiff (day: number, from: number): number {
  return (day - from + 7) % 7;
}

export function dayOfTheWeekOf (baseDate: Date|number, dayOfWeek: number, weekStart = 0): number {
  const baseDay = new Date(baseDate).getDay();

  return addDays(baseDate, dayDiff(dayOfWeek, weekStart) - dayDiff(baseDay, weekStart));
}
