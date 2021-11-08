import * as customMutations from '@customGraphql/customMutations';
import * as mutations from '@graphql/mutations';
import {API, graphqlOperation} from 'aws-amplify';
import {useState} from 'react';

type NewType = () => void;

interface Options {
  custom?: boolean;
  onCancel?: NewType;
  onSuccess?: (data: any) => void;
}

const useGraphqlMutation = (
  mutationName: string,
  options?: Options
): {
  mutate: (variables: any) => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  error: string;
} => {
  const {custom = false, onCancel = () => {}, onSuccess} = options || {};
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');

  const action = custom ? customMutations : mutations;

  const mutate = async (variables: any) => {
    setIsLoading(true);
    try {
      const res: any = await API.graphql(
        //   @ts-ignore
        graphqlOperation(action[mutationName], variables)
      );

      const data = res.data[mutationName];
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(data);
      }
    } catch (error) {
      setIsError(true);

      setError(error.message);
      console.error(error);
    } finally {
      if (onCancel && typeof onCancel === 'function') {
        onCancel();
      }
      setIsLoading(false);
    }
  };

  return {mutate, isLoading, isError, error};
};

export default useGraphqlMutation;
