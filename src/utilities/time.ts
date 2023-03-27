import moment from 'moment';

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

  const world = `${dayNumber}${separator}${monthNumber + 1}${separator}${year}`;

  if (locale === 'US') {
    return `${monthNumber + 1}${separator}${dayNumber}${separator}${year}`;
  }
  if (locale === 'WORLD') {
    return world;
  }
  return world;
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
    : m > 0
    ? `${h ? `${h.toString()} ${h > 1 ? 'hrs' : 'hr'}` : ''} ${m.toString()} minutes`
    : `${h.toString()} ${h > 1 ? 'hrs' : 'hr'}`;
};

/**
 * Function to generate time array
 * In 24 hour format
 * with 30 min interval
 * using moment
 */
export function timeIntervals(): any[] {
  let items: any[] = [];
  new Array(24).fill(undefined).forEach((_, index: number) => {
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

export const getFormatedDate = (date: string) => {
  if (date) {
    if (date !== '-') {
      return date.split(',')[0];
    } else {
      return '-';
    }
  }
  return '-';
};
