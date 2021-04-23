interface SessionDataManagement {
  queryObj: {
    name: string;
    valueObj: any;
  };
}

export const getSessionData = (query: SessionDataManagement['queryObj']) => {
  const stringifiedQuery = JSON.stringify(query);
  return JSON.parse(window.sessionStorage.getItem(stringifiedQuery));
};

export const setSessionData = (query: SessionDataManagement['queryObj'], data: any) => {
  const stringifiedQuery = JSON.stringify(query);
  const stringifiedData = JSON.stringify(data);
  window.sessionStorage.setItem(stringifiedQuery, stringifiedData);
};
