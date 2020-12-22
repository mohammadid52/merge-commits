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
 * Function used in multiple places
 * Unsure what it does exactly??
 * @param str
 */
export const keywordParser = (str: string) => {
  if (typeof str !== 'string') {
    return null;
  }
  let tempWord = '';
  let initialArray = Array.from(str);
  let finalArray = [];
  initialArray.forEach((letter) => {
    if (letter !== ',') {
      tempWord = tempWord + letter;
    } else {
      finalArray.push(tempWord + ',');
      tempWord = '';
    }
  });

  finalArray.push(tempWord);

  return finalArray;
};

export const keywordCapitilizer = (str: string) => {
  let capitalizedStr = str.replace(/^\w/, (char) => char.toUpperCase());
  return capitalizedStr;
};
