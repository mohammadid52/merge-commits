import * as customQueries from 'customGraphql/customQueries';
import * as queries from 'graphql/queries';
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

interface Options {
  enabled?: boolean;
  loopOnNextToken?: boolean;
  custom?: boolean;
  onSuccess?: (data: any, updateCallback?: (updatedData: any) => void) => void;
}

/**
 *
 * @param queryName
 * @param variables
 * @param param2
 * @returns
 */

const useGraphqlQuery = <VariablesType, ReturnType>(
  queryName: string,
  variables: VariablesType,
  options?: Options
): {
  data?: ReturnType | [];
  isSuccess?: boolean;
  isLoading?: boolean;
  isFetched?: boolean;
  isError?: boolean;
  error?: string;
  setData?: React.Dispatch<React.SetStateAction<ReturnType>>;
  refetch?: (variables?: VariablesType) => Promise<any>;
} => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');
  const [isFetched, setIsFetched] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState<ReturnType | []>([]);

  const {enabled = true, loopOnNextToken = false, custom = false, onSuccess = () => {}} =
    options || {};

  const action = custom ? customQueries : queries;

  const fetch = async (
    nextToken?: string,
    loopArray?: any[],
    _variables?: VariablesType
  ) => {
    try {
      const _v = _variables || variables;

      setIsLoading(true);
      const res: any = await API.graphql(
        // @ts-ignore
        graphqlOperation(action[queryName], {..._v, nextToken: nextToken})
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

  const refetch = (variables: VariablesType) => fetch(null, [], variables);

  useEffect(() => {
    if (!isFetched && enabled) {
      fetch();
    }
  }, [isFetched, enabled]);

  return {data, isSuccess, isLoading, setData, isError, error, isFetched, refetch};
};

export default useGraphqlQuery;
