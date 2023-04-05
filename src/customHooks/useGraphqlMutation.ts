import {API, graphqlOperation} from 'aws-amplify';
import {useCallback, useState} from 'react';
import {logError} from 'graphql-functions/functions';
import useAuth from './useAuth';

interface Options {
  custom?: boolean;
  onCancel?: Function;
  onSuccess?: (data: any) => void;
}

const useGraphqlMutation = <VariablesType, ReturnType>(
  mutationName: string,
  options?: Options
): {
  mutate: (
    variables: VariablesType,
    successCallback?: () => void
  ) => Promise<ReturnType | boolean | undefined>;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: string;
} => {
  const {onCancel = () => {}, onSuccess} = options || {};
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const {authId, email} = useAuth();

  const mutate = useCallback(
    async (
      variables: VariablesType,
      successCallback?: () => void
    ): Promise<ReturnType | undefined | boolean> => {
      setIsLoading(true);
      try {
        const res: any = await API.graphql(
          // @ts-ignore
          graphqlOperation(mutationName, variables)
        );

        const data: ReturnType = res.data[mutationName];
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(data);
          setIsSuccess(true);
          if (successCallback && typeof successCallback === 'function') {
            successCallback();
          }
        }
        return data;
      } catch (error) {
        setIsError(true);
        setIsSuccess(false);
        setError(error.message);
        console.error(error);
        logError(error, {authId, email}, 'useGraphqlMutation');
        return false;
      } finally {
        if (onCancel && typeof onCancel === 'function') {
          onCancel();
        }

        setIsLoading(false);

        return false;
      }
    },
    []
  );

  return {mutate, isLoading, isError, error, isSuccess};
};

export default useGraphqlMutation;
