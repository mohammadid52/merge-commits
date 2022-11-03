import moment from 'moment';

interface PatternObject {
  [key: string]: string;
}

/**
 * Quick function to flip around time/date formatting based on input & output pattern
 * Also works with other strings
 * @param pattern
 * @param separator
 * @param inputPattern
 * @param outputPattern
 */
export const formatTime = (
  pattern: string,
  separator: string,
  inputPattern: string,
  outputPattern: string
) => {
  const patternStringObject = pattern.split(separator);
  const originalTime = inputPattern
    .split(separator)
    .reduce((acc: PatternObject, val: string, i: number) => {
      return {...acc, [`${val}`]: patternStringObject[i]};
    }, {});
  const outputTime = outputPattern
    .split(separator)
    .map((val: string, i: number) => originalTime[val]);

  return outputTime.join(separator);
};

/**
 * Quick function to get date string in US format:
 * mm-dd-yyyy
 */
export const awsFormatDate = (date: string) => {
  const reversed = date.split('-').reverse();
  return reversed
    .map((str: string) => {
      if (str !== '-' && str.length === 1) {
        return `0${str}`;
      } else {
        return str;
      }
    })
    .join('-');
};

export const dateString = (
  separator: string,
  locale: 'US' | 'WORLD',
  date?: Date
): string => {
  const d = date ? new Date(date) : new Date();
  const dayNumber = d.getDate();
  const monthNumber = d.getMonth();
  const year = d.getFullYear();

  if (locale === 'US') {
    return `${monthNumber + 1}${separator}${dayNumber}${separator}${year}`;
  }
  if (locale === 'WORLD') {
    return `${dayNumber}${separator}${monthNumber + 1}${separator}${year}`;
  }
};

export const dateFromServer = (date: string) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  return `${month}/${day}/${year}`;
};

export const MinutesToHHMM = (minutes: number, separator?: string) => {
  let m = minutes % 60;
  let h = (minutes - m) / 60;
  return separator === ':'
    ? `${h.toString()}:${m < 10 ? '0' : ''} ${m.toString()}`
    : `${h ? `${h.toString()} hrs` : ''} ${m.toString()} minutes`;
};

/**
 * Function to generate time array
 * In 24 hour format
 * with 30 min interval
 * using moment
 */
export function timeIntervals(): any[] {
  let items: any[] = [];
  new Array(24).fill(undefined).forEach((acc: any, index: number) => {
    items = [
      ...items,
      {
        name: moment({hour: index}).format('h:mm A'),
        value: moment({hour: index}).format('h:mm A')
      }
    ];
    items = [
      ...items,
      {
        name: moment({hour: index, minute: 30}).format('h:mm A'),
        value: moment({hour: index, minute: 30}).format('h:mm A')
      }
    ];
  });

  return items;
}
