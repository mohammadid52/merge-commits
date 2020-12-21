interface PatternObject {
  [key: string]: string;
}

/**
 * Function to rearrange strings based on a pattern/separator
 * @param pattern
 * @param separator
 * @param inputPattern
 * @param outputPattern
 */
export const formatPattern = (pattern: string, separator: string, inputPattern: string, outputPattern: string) => {
  const patternStringObject = pattern.split(separator);
  const originalTime = inputPattern.split(separator).reduce((acc: PatternObject, val: string, i: number) => {
    return { ...acc, [`${val}`]: patternStringObject[i] };
  }, {});
  const outputTime = outputPattern.split(separator).map((val: string, i: number) => originalTime[val]);

  // console.log('formatpattern', patternStringObject);
  // console.log('formatpattern', originalTime);
  // console.log('formatpattern', outputTime);

  // The final; string
  return outputTime.join(separator);
};

/**
 * Parses linebreak characters \n and
 * replaces them with a html break <br>
 * @param inputText
 */
export const parseBlankLines = (inputText: string) => {
  if (typeof inputText !== 'undefined') {
    return inputText.replace(/(\n)+/g, '<br/>');
  } else {
    return 'No input text...';
  }
};

/**
 * Returns text as lowercase
 * @param inputText
 */
export const lc = (inputText: string): string => {
  return inputText.toLowerCase();
};

/**
 * Function used in multiple places to
 * capitalize the first letter of a word
 * @param str
 */
export const firstInitialFunc = (str: string) => {
  if (typeof str !== 'string' || str === '') {
    return 'Profile';
  }
  let firstInitial = str.charAt(0);
  firstInitial = firstInitial.toUpperCase() + '.';
  return firstInitial;
};

/**
 * Below function used in multiple places to
 * Show initials of name and stringToHsl background colors.
 * @param firstName
 * @param lastName
 * ---
 * @param str
 */
export const initials = (firstName: string, lastName: string) => {
  let firstInitial = firstName.charAt(0).toUpperCase();
  let lastInitial = lastName.charAt(0).toUpperCase();
  return firstInitial + lastInitial;
};

export const getInitialsFromString = (str: string) => {
  /**
   * This will retun first two initials from string of multiple words
   * or first two characters of single word.
   */
  const splitedWords = str.split(' ');
  if (splitedWords.length > 1) {
    return splitedWords;
  } else {
    return str.split('');
  }
};

export const stringToHslColor = (str: string) => {
  let hash = 0;
  let i;
  for (i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let h = hash % 360;
  return 'hsl(' + h + ', 70%, 72%)';
};
