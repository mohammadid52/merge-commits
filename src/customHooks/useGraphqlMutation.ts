import * as customMutations from 'customGraphql/customMutations';
import * as mutations from 'graphql/mutations';
import {API, graphqlOperation} from 'aws-amplify';
import {useCallback, useState} from 'react';

interface Options {
  custom?: boolean;
  onCancel?: Function;
  onSuccess?: (data: any) => void;
}

const allMutationNames = [...Object.keys(mutations), ...Object.keys(customMutations)];

type MutationType = typeof allMutationNames[number];

const useGraphqlMutation = <VariablesType, ReturnType>(
  mutationName: MutationType,
  options?: Options
): {
  mutate: (variables: VariablesType, successCallback?: () => void) => Promise<ReturnType>;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: string;
} => {
  const {custom = false, onCancel = () => {}, onSuccess} = options || {};
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const action = custom ? customMutations : mutations;

  if (!allMutationNames.includes(mutationName)) {
    console.error(
      `Mutation ${mutationName} does not exist. Please check the spelling and try again.`
    );
  }

  const mutate = useCallback(
    async (
      variables: VariablesType,
      successCallback?: () => void
    ): Promise<ReturnType> => {
      setIsLoading(true);
      try {
        const res: any = await API.graphql(
          //   @ts-ignore
          graphqlOperation(action[mutationName], variables)
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
      } finally {
        if (onCancel && typeof onCancel === 'function') {
          onCancel();
        }

        setIsLoading(false);
      }
    },
    []
  );

  return {mutate, isLoading, isError, error, isSuccess};
};

export default useGraphqlMutation;
