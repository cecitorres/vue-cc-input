const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate();
const currentWeekDay = currentDate.getDay();

export const CURRENT_DATE = currentDate;

export const CURRENT_YEAR = String(currentYear);

export const CURRENT_MONTH = `0${currentMonth + 1}`.slice(-2);

export const CURRENT_DAY = currentDay;

export const CURRENT_WEEK_DAY = currentWeekDay;
