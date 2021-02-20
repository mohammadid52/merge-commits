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
  if (
    typeof pattern === 'undefined' ||
    typeof separator === 'undefined' ||
    typeof inputPattern === 'undefined' ||
    typeof outputPattern === 'undefined'
  ) {
    return 'param undefined...';
  }

  const patternStringObject = pattern.split(separator);
  const originalTime = inputPattern.split(separator).reduce((acc: PatternObject, val: string, i: number) => {
    return { ...acc, [`${val}`]: patternStringObject[i] };
  }, {});
  const outputTime = outputPattern.split(separator).map((val: string, i: number) => originalTime[val]);

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

/**
 * Function used in multiple places to
 * set array as a filter object while fetching data.
 * @param arr
 * @param key
 */
export const getFilterORArray = (arr: any, key: string) => {
  let newArray = arr.map((item: any) => {
    return {
      [key]: {
        eq: item,
      },
    };
  });
  return newArray;
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

/**
 * Function used for getting hostname from web url
 * @param url
 */

export const getHostNameFromUrl = (url: string) => {
  try {
    const webUrl = new URL(url);
    if (webUrl) {
      return webUrl.hostname;
    }
    return url;
  } catch {
    return url;
  }
};

/**
 * Function used to format phone number in (xxx)xxx-xxxx format
 * @param str
 */

export const formatPhoneNumber = (str: string) => {
  //Filter only numbers from the input
  let cleaned = ('' + str).replace(/\D/g, '');

  //Check if the input is of correct length
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }

  return str;
};

/**
 * Function used in multiple places to
 * set array as a filter object while fetching data.
 * @param arr
 * @param key
 */
export const createFilterToFetchSpecificItemsOnly = (arr: any, key: string) => {
  if (arr.length) {
    let newArray = arr.map((item: any) => {
      return {
        [key]: {
          eq: item,
        },
      };
    });
    return { or: newArray };
  }
  return {};
};

/**
 * Function used in multiple places to
 * set array as a filter object while fetching data.
 * @param arr
 * @param key
 */
export const createFilterToFetchAllItemsExcept = (arr: any, key: string) => {
  if (arr.length) {
    let newArray = arr.map((item: any) => {
      return {
        [key]: {
          ne: item,
        },
      };
    });
    return { and: newArray };
  }
  return {};
};

/**
 * Function used in multiple places to
 * reorder the list sequence while using drag and drop in table list.
 * @param list
 * @param startIndex
 * @param endIndex
 */
export const reorder = (list: any, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const getClientKey = () => {
  const url = window.location.href;
  if (url.indexOf('localhost') >= 0) return 'iconoclast';
  if (url.indexOf('iconoclast') >= 0) return 'iconoclast';
  if (url.indexOf('curate') >= 0) return 'curate';
  else '';
};

export const getLanguageString = (language: string) => {
  switch (language) {
    case 'EN':
      return 'English';
    case 'ES':
      return 'Spanish';
  }
};

export const getTypeString = (type: string) => {
  switch (type) {
    case 'text':
      return 'Text';
    case 'input':
      return 'Input';
    case 'selectMany':
      return 'Select Many';
    case 'selectOne':
      return 'Select One';
    default:
      return 'Text';
  }
};

export const getLessonType = (type: string) => {
  switch (type) {
    case 'lesson':
      return 'Lesson';
    case 'survey':
      return 'Survey';
    case 'assessment':
      return 'Assessment';
  }
};

export const getUserRoleString = (role: string) => {
  switch (role) {
    case 'ADM':
      return 'Admin';
    case 'BLD':
      return 'Builder';
    case 'FLW':
      return 'Fellow';
    case 'CRD':
      return 'Coordinator';
    case 'TR':
      return 'Teacher';
    case 'ST':
      return 'Student';
  }
};
