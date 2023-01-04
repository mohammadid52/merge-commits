import {getAsset} from 'assets';
import {isEmpty} from 'lodash';
import {getLocalStorageData, setLocalStorageData} from './localStorage';
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
  var maxrows = 50;
  var txt = textbox.value;
  var cols = textbox.cols;

  var arraytxt: any = txt.split('\n');
  var rows = arraytxt.length;

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
  if (str.length > 0) {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
  }
};

export const removeExtension = (filename: string) => {
  const lastDotPosition = filename.lastIndexOf('.');
  if (lastDotPosition === -1) return filename;
  else return filename.substr(0, lastDotPosition);
};

export const ellipsis = (text: string, len: number): string => {
  if (text) {
    if (text.length <= len) {
      return text;
    } else {
      return `${text.substring(0, len)}...`;
    }
  }
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

export const paginationPage = (lang: string, page: number, total: number) => {
  if (lang === 'EN') return `Showing Page ${page + 1} of ${total} pages`;
  if (lang === 'ES') return `Mostrando página ${page + 1} de ${total} páginas`;
  return '';
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
