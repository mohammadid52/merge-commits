export const getSessionStorageData = (key: string) => {
  const toParse = window?.sessionStorage?.getItem?.(key) || '{}';
  return JSON.parse(toParse);
};

export const setSessionStorageData = (key: string, dataObj: any) => {
  const stringifiedDataObj = JSON.stringify(dataObj);
  window.sessionStorage.setItem(key, stringifiedDataObj);
};

export const removeSessionStorageData = (key: string) => {
  window.sessionStorage.removeItem(key);
};
