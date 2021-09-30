export const getSessionStorage = (key: string) => {
  return JSON.parse(window.sessionStorage.getItem(key));
};

export const setSessionStorage = (key: string, dataObj: any) => {
  const stringifiedDataObj = JSON.stringify(dataObj);
  window.sessionStorage.setItem(key, stringifiedDataObj);
};

export const removeSessionStorage = (key: string) => {
  window.sessionStorage.removeItem(key);
};
