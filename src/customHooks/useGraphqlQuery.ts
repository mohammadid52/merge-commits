import * as customQueries from '@customGraphql/customQueries';
import * as queries from '@graphql/queries';
import {API, graphqlOperation} from 'aws-amplify';
import {useEffect, useState} from 'react';

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

/**
 *
 * @param queryName
 * @param variables
 * @param param2
 * @returns
 */

const useGraphqlQuery = <T>(
  queryName: string,
  variables: T,
  {
    enabled = true,
    loopOnNextToken = false,
    custom = false,
    onSuccess = () => {},
  }: {
    enabled?: boolean;
    loopOnNextToken?: boolean;
    custom?: boolean;
    onSuccess?: (data: any, updateCallback?: (updatedData: any) => void) => void;
  }
): {
  data?: T;
  isSuccess?: boolean;
  isLoading?: boolean;
  isFetched?: boolean;
  isError?: boolean;
  error?: string;
  setData?: React.Dispatch<React.SetStateAction<T>>;
  refetch?: () => Promise<any>;
} => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');
  const [isFetched, setIsFetched] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState<T>();

  const action = custom ? customQueries : queries;

  const fetch = async (nextToken?: string, loopArray?: any[]) => {
    try {
      setIsLoading(true);
      const res: any = await API.graphql(
        // @ts-ignore
        graphqlOperation(action[queryName], {...variables, nextToken: nextToken})
      );
      const data = res.data[queryName].items;
      const theNextToken = res.data[queryName]?.nextToken;
      const outputData = loopArray ? [...loopArray, ...data] : data;

      if (theNextToken && loopOnNextToken) {
        await fetch(theNextToken, outputData);
      } else {
        if (outputData.length > 0) {
          setIsSuccess(true);
          setData(outputData);
          setError('');
          setIsError(false);
          if (onSuccess && typeof onSuccess === 'function') {
            onSuccess(outputData, (updatedData) => setData(updatedData));
          }
          return outputData;
        }
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setError(error.message);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
      setIsFetched(true);
    }
  };

  const refetch = () => fetch();

  useEffect(() => {
    if (!isFetched && enabled) {
      fetch();
    }
  }, [isFetched, enabled]);

  return {data, isSuccess, isLoading, setData, isError, error, isFetched, refetch};
};

export default useGraphqlQuery;
