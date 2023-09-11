import { format, sub, startOfMonth } from 'date-fns';

export default async function curdate() {
  const currentDate = new Date();
  const firstDayOfCurrentMonth = startOfMonth(currentDate-1);
  const lastDayOfPreviousMonth = sub(firstDayOfCurrentMonth, { days: 1 });
  const firstDayOfPreviousMonth = startOfMonth(lastDayOfPreviousMonth);

  const dateFormat = "yyyy-MM-dd'T'HH:mm:ssxxx";
  const firstDayFormatted = format(firstDayOfPreviousMonth, dateFormat);
  const lastDayFormatted = format(lastDayOfPreviousMonth, dateFormat);

  return {
    firstDay: firstDayFormatted,
    lastDay: lastDayFormatted
  };
}

// Usage example
//const { firstDay, lastDay } = curdate();
//console.log(firstDay, lastDay);
