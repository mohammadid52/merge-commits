export const getLocalStorageData = (key: string) => {
  const toParse = window?.localStorage?.getItem?.(key) || "{}";
  return JSON.parse(toParse);
};

export const setLocalStorageData = (key: string, dataObj: any) => {
  const stringifiedDataObj = JSON.stringify(dataObj);
  window.localStorage.setItem(key, stringifiedDataObj);
};

export const removeLocalStorageData = (key: string) => {
  window.localStorage.removeItem(key);
};
