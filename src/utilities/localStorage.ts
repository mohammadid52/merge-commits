export const getLocalStorageData = (key: string) => {
  return JSON.parse(window.localStorage.getItem(key));
};

export const setLocalStorageData = (key: string, dataObj: any) => {
  const stringifiedDataObj = JSON.stringify(dataObj);
  window.localStorage.setItem(key, stringifiedDataObj);
};

export const removeLocalStorageData = (key: string) => {
  window.localStorage.removeItem(key);
};
