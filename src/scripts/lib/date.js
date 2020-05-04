export function isDate (date) {
  return date instanceof Date && !isNaN(date);
}

export function getTime (date) {
  return new Date(date).setHours(0, 0, 0, 0);
}

export function today () {
  return new Date().getTime();
}

export function dateValue (year, month, day) {
  const newDate = new Date(0);
  newDate.setFullYear(year, month, day);

  return newDate.setHours(0, 0, 0, 0);
}

export function addDays (date, amount) {
  const newDate = new Date(date);

  return newDate.setDate(newDate.getDate() + amount);
}

export function addWeeks (date, amount) {
  return addDays(date, amount * 7);
}

export function addMonths (date, amount) {
  const newDate = new Date(date);
  const monthsToSet = newDate.getMonth() + amount;
  let expectedMonth = monthsToSet % 12;

  if (expectedMonth < 0) {
    expectedMonth += 12;
  }

  const time = newDate.setMonth(monthsToSet);
  return newDate.getMonth() !== expectedMonth ? newDate.setDate(0) : time;
}

export function addYears (date, amount) {
  // If the date is Feb 29 and the new year is not a leap year, Feb 28 of the
  // new year will be returned.
  const newDate = new Date(date);
  const expectedMonth = newDate.getMonth();
  const time = newDate.setFullYear(newDate.getFullYear() + amount);
  return expectedMonth === 1 && newDate.getMonth() === 2 ? newDate.setDate(0) : time;
}

function dayDiff (day, from) {
  return (day - from + 7) % 7;
}

export function dayOfTheWeekOf (baseDate, dayOfWeek, weekStart = 0) {
  const baseDay = new Date(baseDate).getDay();
  return addDays(baseDate, dayDiff(dayOfWeek, weekStart) - dayDiff(baseDay, weekStart));
}

export function getWeek (date) {
  const thuOfTheWeek = dayOfTheWeekOf (date, 4, 1);
  const firstThu = dayOfTheWeekOf(new Date(thuOfTheWeek).setMonth(0, 4), 4, 1);
  return Math.round((thuOfTheWeek - firstThu) / 604800000) + 1;
}

export function startOfYearPeriod (date, years) {
  const year = new Date(date).getFullYear();
  return Math.floor(year / years) * years;
}
