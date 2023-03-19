import {RoomStatus} from 'API';
import {getAsset} from 'assets';
import {isEmpty} from 'lodash';
import {allowedAuthIds} from 'state/GlobalState';
import {getLocalStorageData, setLocalStorageData} from './localStorage';
import {getImageFromS3Static} from './services';
import {getClientKey} from './strings';

export const goBackBreadCrumb = (list: any[], history: any) => {
  const lastSecondIdx = list.length - 2;
  const url = list[lastSecondIdx]?.url;
  if (url) {
    history.push(url);
  } else {
    history.goBack();
  }
};

export const doResize = (textbox: any) => {
  const maxrows = 50;
  const txt = textbox.value;
  const cols = textbox.cols;

  const arraytxt: any = txt.split('\n');
  let rows = arraytxt.length;

  for (let i = 0; i < arraytxt.length; i++)
    // @ts-ignore
    rows += parseInt(arraytxt[i].length / cols);

  if (rows > maxrows) textbox.rows = maxrows;
  else textbox.rows = rows;
};
export const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const capitalizeFirstLetter = (str: string = '') => {
  if (str && str.length > 0) {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
  }
  return '';
};

export const removeExtension = (filename: string) => {
  if (filename.length > 0) {
    const lastDotPosition = filename.lastIndexOf('.');
    if (lastDotPosition === -1) return filename;
    else return filename.substr(0, lastDotPosition);
  }
  return '';
};

export const ellipsis = (text: string, len: number): string => {
  if (text) {
    if (text.length <= len) {
      return text;
    } else {
      return `${text.substring(0, len)}...`;
    }
  }
  return '';
};

export const randomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const getJSON = async (url: string): Promise<string> => {
  const doestThisJsonExistsInLocalStorage = getLocalStorageData(url);
  if (!isEmpty(doestThisJsonExistsInLocalStorage)) {
    return doestThisJsonExistsInLocalStorage;
  } else {
    const response = await fetch(url);
    const json = await response.json();

    setLocalStorageData(url, json);
    return json;
  }
};

export const setPageTitle = (title: string) => {
  if (title) {
    document.title = `${title} | `.concat(getAsset(getClientKey(), 'appTitle'));
  }
};

export const getExtension = (str: string) => {
  let temp = str.split('.');

  const extension = temp.pop();
  return extension;
};

export const focusOn = (id: string) => {
  const el = document.getElementById(id);

  if (el) {
    el.classList.add('blink');
    setTimeout(() => {
      el.classList.remove('blink');
    }, 2000);
  }
};

const zoiqFilterFallback = (authId: string) =>
  allowedAuthIds.includes(authId) ? [] : [{isZoiq: {ne: true}}];

export const withZoiqFilter = (generalFilter: any, _zoiqFilter?: any) => {
  try {
    let zoiqFilter =
      _zoiqFilter && _zoiqFilter?.length > 0
        ? _zoiqFilter
        : zoiqFilterFallback && zoiqFilterFallback.length > 0
        ? zoiqFilterFallback
        : [];

    let filter: any = {};
    filter =
      zoiqFilter?.length > 0
        ? {
            ...generalFilter,
            or: [generalFilter?.or, generalFilter?.and, ...zoiqFilter].filter(Boolean)
          }
        : generalFilter;

    return filter;
  } catch (error) {
    return generalFilter;
  }
};

export const getSignInError = (error: any, onlyEmail: any) => {
  switch (error.code) {
    case 'UserNotFoundException':
      return {
        show: true,
        type: 'error',
        message: 'The email you entered was not found'
      };
    case 'NotAuthorizedException':
      if (!onlyEmail) {
        return {
          show: true,
          type: 'error',
          message: 'The email or password you entered was not correct'
        };
      }
      return;
    case 'UserNotConfirmedException':
      return {
        show: true,
        type: 'error',
        message: 'You need to confirm registered email id, Please check your email.'
      };
    // shows valid error message for confirmation error instead of redirecting to confirm-code rout.

    default:
      return {
        show: true,
        type: 'error',
        message: error.message
      };
  }
};

export const getUserInfo = (userInfo: any) => ({
  id: userInfo.id,
  firstName: userInfo.preferredName || userInfo.firstName,
  lastName: userInfo.lastName,
  language: userInfo.language,
  onBoardSurvey: userInfo.onBoardSurvey ? userInfo.onBoardSurvey : false,
  role: userInfo.role,
  image: userInfo.image,
  location: userInfo?.location?.items,
  lastLoggedIn: userInfo.lastLoggedIn,
  lastLoggedOut: userInfo.lastLoggedOut,

  onDemand: userInfo?.onDemand,
  lessons: userInfo.lessons,
  lastEmotionSubmission: userInfo?.lastEmotionSubmission,
  removedFrom: userInfo?.removedFrom,
  status: userInfo?.status
});

export const setCredCookies = (
  rememberMe: boolean,
  cookies: {setCookie: any; removeCookie: any},
  auth: {
    name: string;
    email: string;
    password: string;
  }
) => {
  if (rememberMe && Boolean(auth.email && auth.password && auth.name)) {
    cookies.setCookie(
      'cred',
      {
        email: auth.email,
        checked: Boolean(rememberMe),
        password: auth.password,
        name: auth.name
      },
      {path: '/'}
    );
  } else {
    cookies.removeCookie('cred');
  }
};

export const reorderSyllabus = (syllabusArray: any[], sequenceArray: any[]) => {
  const filteredSyllabusArray = syllabusArray.filter((d) => d.unit !== null);

  let getSyllabusInSequence =
    sequenceArray && sequenceArray.length > 0
      ? sequenceArray?.reduce((acc: any[], syllabusID: string) => {
          return [
            ...acc,
            filteredSyllabusArray.find((syllabus: any) => syllabus.unitId === syllabusID)
          ];
        }, [])
      : filteredSyllabusArray;

  let mapSyllabusToSequence =
    sequenceArray && sequenceArray.length > 0
      ? getSyllabusInSequence
          ?.map((syllabus: any) => {
            return {
              ...syllabus,
              ...syllabus.unit,
              lessons: {
                ...syllabus?.unit?.lessons,
                items:
                  syllabus?.unit.lessons?.items?.length > 0
                    ? syllabus?.unit.lessons.items
                        .map((t: any) => {
                          let index = syllabus?.universalLessonsSeq?.indexOf(t.id);
                          return {...t, index};
                        })
                        .sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
                    : []
              }
            };
          })
          .map(({unit, ...rest}: any) => rest)
      : getSyllabusInSequence;

  return mapSyllabusToSequence;
};

export const getTodayDate = () => {
  let today: any = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  today = mm + '-' + dd + '-' + yyyy;
  return today;
};

export const insertExtraDataForClassroom = (cr: any) => {
  const teacherImage = getImageFromS3Static(cr?.teacher?.image);
  return {
    institutionName: cr?.institution?.name || '',
    teacher: {
      name: `${cr?.teacher?.firstName} ${cr?.teacher?.lastName}`,
      image: teacherImage
    },
    courseName: cr?.curricula?.items[0]?.curriculum?.name || '',
    status: cr?.status || RoomStatus.ACTIVE,
    activeSyllabus: cr?.activeSyllabus
  };
};

export const removeDuplicates = (array: any[]) => {
  let ids: any[] = [];

  let result: any[] = [];
  array.forEach((item) => {
    if (!ids.includes(item?.id)) {
      result.push(item);
      ids.push(item.id);
    }
  });
  return result;
};

export const getSeparatedHeaders = (arr: any[]) => {
  let reg = /[,.]/gi;

  if (arr && arr.length > 0) {
    let result = arr.map((i) => {
      return {
        ...i,
        label: i.label.replaceAll(reg, '')
      };
    });

    return result;
  }
  return arr;
};
