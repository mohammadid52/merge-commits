import API, { graphqlOperation } from '@aws-amplify/api';
const queries = require('../graphql/queries');
const customQueries = require('../customGraphql/customQueries');

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

export const handleFetchAndCache = async (query: SessionDataManagement['queryObj']) => {
  const [source, querySelector] = query.name.split('.');

  const querySource = source === 'queries' ? queries : customQueries;
  const sessionData = getSessionData(query);

  if (sessionData) {
    console.log('session data --> ', query.valueObj);
    return sessionData;
  } else {
    try {
      const fetchData: any = await API.graphql(graphqlOperation(querySource[querySelector], query.valueObj));
      console.log('new fetch -> ', query.valueObj);
      setSessionData(query, fetchData);
      return fetchData;
    } catch (e) {
      console.error('handleFetchAndCache -> ', e);
    }
  }
};
