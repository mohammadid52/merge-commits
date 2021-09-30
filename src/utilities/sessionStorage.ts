export const getSessionStorageData = (key: string) => {
  return JSON.parse(window.sessionStorage.getItem(key));
};

export const setSessionStorageData = (key: string, dataObj: any) => {
  const stringifiedDataObj = JSON.stringify(dataObj);
  window.sessionStorage.setItem(key, stringifiedDataObj);
};

export const removeSessionStorageData = (key: string) => {
  window.sessionStorage.removeItem(key);
};
