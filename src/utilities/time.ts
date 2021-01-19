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
export const formatTime = (pattern: string, separator: string, inputPattern: string, outputPattern: string) => {
  const patternStringObject = pattern.split(separator);
  const originalTime = inputPattern.split(separator).reduce((acc: PatternObject, val: string, i: number) => {
    return { ...acc, [`${val}`]: patternStringObject[i] };
  }, {});
  const outputTime = outputPattern.split(separator).map((val: string, i: number) => originalTime[val]);

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

export const dateString = (separator: string, locale: 'US' | 'WORLD'): string => {
  const d = new Date();
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
