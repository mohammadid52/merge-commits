import * as customQueries from '@customGraphql/customQueries';
import * as queries from '@graphql/queries';
import {API, graphqlOperation} from 'aws-amplify';
import {useEffect, useState} from 'react';

const useGraphqlQuery = (
  queryName: string,
  variables: any,
  {
    enabled = true,
    custom = false,
    onSuccess = () => {},
  }: {
    enabled?: boolean;
    custom?: boolean;
    onSuccess?: (data: any, updateCallback?: (updatedData: any) => void) => void;
  }
): {
  data?: any;
  isSuccess?: boolean;
  isLoading?: boolean;
  isFetched?: boolean;
  isError?: boolean;
  error?: string;
  setData?: React.Dispatch<React.SetStateAction<any>>;
  refetch?: () => Promise<any>;
} => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');
  const [isFetched, setIsFetched] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState<any>();

  const action = custom ? customQueries : queries;

  const fetch = async () => {
    try {
      setIsLoading(true);
      // @ts-ignore

      const res: any = await API.graphql(graphqlOperation(action[queryName], variables));
      const data = res.data[queryName].items;
      if (data.length > 0) {
        setIsSuccess(true);
        setData(data);
        setError('');
        setIsError(false);
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(data, (updatedData) => setData(updatedData));
        }
        return data;
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
