import {API, graphqlOperation} from 'aws-amplify';
import {useEffect, useState} from 'react';
import {isEmpty} from 'lodash';
import {logError} from 'graphql-functions/functions';
import useAuth from './useAuth';

/*
  Example:
  const {data, isSuccess, isLoading, setData, isError, error, isFetched, refetch} = useGraphqlQuery('getAllPosts', {}, {
    enabled: true,
    loopOnNextToken: true,
    custom: false,
    onSuccess: (data: any, updateCallback?: (updatedData: any) => void) => {
      console.log(data);
    },
  }); */

interface Options {
  enabled?: boolean;
  loopOnNextToken?: boolean;
  custom?: boolean;
  originalName?: string;
  onSuccess?: (data: any, updateCallback?: (updatedData: any) => void) => void;
}

/**
 *
 * @param queryName
 * @param variables
 * @param param2
 * @returns
 */

const useGraphqlQuery = <VariablesType, ReturnType = any[]>(
  queryName: any,
  variables: VariablesType,
  options?: Options
): {
  data: ReturnType | [];
  isSuccess: boolean;
  isLoading: boolean;
  isFetched: boolean;
  isError: boolean;
  error: string;
  setData: React.Dispatch<React.SetStateAction<ReturnType | []>>;
  refetch: (variables?: VariablesType) => Promise<any>;
} => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');
  const [isFetched, setIsFetched] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState<ReturnType | []>([]);

  const {
    enabled = true,
    loopOnNextToken = false,
    custom = false,
    onSuccess = () => {}
  } = options || {};

  const _queryName = custom ? options?.originalName || queryName : queryName;

  const isGet = queryName.startsWith('get');
  const {authId, email} = useAuth();

  const fetch = async (
    nextToken?: string,
    loopArray?: any[],
    _variables?: VariablesType
  ) => {
    try {
      const _v = _variables || variables;

      setIsLoading(true);
      const res: any = await API.graphql(
        graphqlOperation(queryName, {..._v, nextToken: nextToken})
      );

      const data = isGet ? res.data[_queryName] : res.data[_queryName].items;

      const theNextToken = isGet ? null : res.data[_queryName]?.nextToken;
      const outputData = isGet ? data : loopArray ? [...loopArray, ...data] : data;

      if (theNextToken && loopOnNextToken) {
        await fetch(theNextToken, outputData);
      } else {
        if (outputData.length === 0) {
          setData([]);
        }

        if ((isGet && isEmpty(outputData)) || (!isGet && outputData.length > 0)) {
          setIsSuccess(true);
          setData(outputData);
          setError('');
          setIsError(false);
          if (onSuccess && typeof onSuccess === 'function') {
            onSuccess(outputData, (updatedData: ReturnType) => setData(updatedData));
          }

          return outputData;
        }
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setError(error.message);
      setIsSuccess(false);
      logError(error, {authId, email}, 'useGraphlQuery');
    } finally {
      setIsLoading(false);
      setIsFetched(true);
    }
  };

  const refetch = (variables?: VariablesType) => fetch(undefined, [], variables);

  useEffect(() => {
    if (!isFetched && enabled) {
      fetch();
    }
  }, [isFetched, enabled]);

  return {
    data,
    isSuccess,
    isLoading,
    setData,
    isError,
    error,
    isFetched,
    refetch
  };
};

export default useGraphqlQuery;
