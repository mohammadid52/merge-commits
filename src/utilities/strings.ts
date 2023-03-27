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
        eq: item
      }
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
  let firstInitial = firstName?.charAt(0).toUpperCase() || '';
  let lastInitial = lastName?.charAt(0).toUpperCase() || '';
  return firstInitial + lastInitial;
};

export const stringToHslColor = (str: string = '') => {
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
          eq: item
        }
      };
    });
    return {or: newArray};
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
          ne: item
        }
      };
    });
    return {and: newArray};
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
  const url = new URL(window.location.href);
  let hostname = url.hostname;
  if (hostname.indexOf('localhost') >= 0) return 'iconoclast';
  if (hostname.indexOf('lms') >= 0) return 'demo';
  if (hostname.indexOf('demo') >= 0) return 'demo';
  if (hostname.indexOf('iconoclast') >= 0) return 'iconoclast';
  if (hostname.indexOf('curate') >= 0) return 'curate';
  else return 'iconoclast';
};

/**
 * Function used to fiterout uniqitems based on specific key
 * from an array of objects
 * @param arr
 * @param key
 */
export const getUniqItems = (arr: any[], key: string) => {
  let uniqItems: any = [];
  const updatedArray = arr.filter((item) => {
    if (uniqItems.indexOf(item[key]) < 0) {
      uniqItems.push(item[key]);
      return item;
    }
  });
  return updatedArray;
};

export const convertArrayIntoObj = (answerArray: any[]) => {
  return answerArray.reduce((obj: any, item: any) => {
    obj[Object.keys(item)[0]] = Object.values(item)[0];
    return obj;
  }, {});
};

export const getLanguageString = (language: string): 'English' | 'Spanish' => {
  switch (language) {
    case 'EN':
      return 'English';
    case 'ES':
      return 'Spanish';

    default:
      return 'English';
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
    case 'datePicker':
      return 'Date Picker';
    case 'link':
      return 'link';
    case 'emoji':
      return 'Emoji';
    case 'attachments':
      return 'Attachments';
    default:
      return 'Text';
  }
};

export const getLessonType = (type: string): string => {
  switch (type) {
    case 'lesson':
      return 'Lesson';
    case 'survey':
      return 'Survey';
    case 'assessment':
      return 'Assessment';
    default:
      return 'Lesson';
  }
};

export const getUserRoleString = (role: string): string => {
  switch (role) {
    case 'SUP':
      return 'Super Admin';
    case 'ADM':
      return 'Admin';
    case 'BLD':
      return 'Builder';
    case 'FLW':
      return 'Fellow';

    case 'TR':
      return 'Teacher';
    case 'ST':
      return 'Student';
    default:
      return 'Student';
  }
};
export const getReverseUserRoleString = (role: string): string => {
  switch (role) {
    case 'Super Admin':
      return 'SUP';
    case 'Admin':
      return 'ADM';
    case 'Builder':
      return 'BLD';
    case 'Fellow':
      return 'FLW';
    case 'Teacher':
      return 'TR';
    case 'Student':
      return 'ST';
    default:
      return 'ST';
  }
};

export const replaceAll = (content: string, replaceObj: any) => {
  for (const key in replaceObj) {
    if (replaceObj.hasOwnProperty(key)) {
      const val = replaceObj[key];
      content = content.replace(new RegExp(`{${key}}`, 'g'), val);
    }
  }
  return content;
};

// regex match double spaces and replace with single space
const removeDoubleSpaces = (str: string) => {
  if (!str) return '';
  return str.replace(/\s{2,}/g, ' ');
};

// regex match double quotations and replace with single quotations
const removeDoubleQuotes = (str: string) => {
  if (!str) return '';
  return str.replace(/\"/g, "'");
};

const pipeFn =
  (...fns: any[]) =>
  (arg: any) =>
    fns.reduce((acc, fn) => fn(acc), arg);

export const cleanString = (str: string) => {
  return pipeFn(removeDoubleSpaces, removeDoubleQuotes)(str);
};
