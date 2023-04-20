import Buttons from '@components/Atoms/Buttons';
import Loader from '@components/Atoms/Loader';
import DemographicsEdit from '@components/Dashboard/Demographics/DemographicsEdit';
import {
  extractItemFromArray,
  saveAllCheckpointData
} from '@components/Dashboard/Profile/ProfileEdit';
import {getPersonData} from '@customGraphql/customQueries';
import useAuth from '@customHooks/useAuth';
import {useQuery} from '@tanstack/react-query';
import {convertArrayIntoObj} from '@utilities/strings';
import {Checkpoint, QuestionData} from 'API';
import {API, graphqlOperation} from 'aws-amplify';
import {getQuestionData, getUserCheckpoints, logError} from 'graphql-functions/functions';
import {useState} from 'react';

const DemographicsBlock = ({id}: any) => {
  const {isStudent, authId, email} = useAuth();

  const fetchDemographicsQuestions = async () => {
    try {
      const res: any = await API.graphql(
        graphqlOperation(getPersonData, {
          authId: authId,
          email: email
        })
      );

      const person = res.data.getPerson;
      const {checkpointIds, checkpoints} = getUserCheckpoints(person);

      setCheckpoints(checkpoints);

      return checkpointIds;
    } catch (error) {
      console.error(error);
      logError(error, {authId, email}, 'DemographicsBlock @fetchDemographicsQuestions ');
    }
  };

  const [questionData, setQuestionData] = useState<QuestionData[]>([]);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [checkpointData, setCheckpointData] = useState<any>({});

  const {isLoading, isFetched} = useQuery({
    queryKey: [`demographics-questions-${id}`],
    queryFn: fetchDemographicsQuestions,
    retryOnMount: false,

    refetchOnWindowFocus: false,
    onSuccess(data) {
      getQuestionData(email, authId, data).then((questionDataList) => {
        if (questionDataList && questionDataList.length > 0) {
          setQuestionData(questionDataList);
          const updatedListArray: any = questionDataList.map((item: any) => ({
            [item['checkpointID']]: extractItemFromArray(item.responseObject)
          }));

          const updatedListObj: any = convertArrayIntoObj(updatedListArray);

          setCheckpointData({
            ...updatedListObj
          });
        }
      });
    },
    enabled: isStudent
  });

  if (!isStudent) {
    return (
      <div>
        <h3 className="text-white">This is a student only block</h3>
      </div>
    );
  }

  if (isLoading && !isFetched)
    return <Loader size="small" withText="getting demographic questions..." />;

  return (
    <div>
      <DemographicsEdit
        isInLesson
        stdCheckpoints={checkpoints}
        checkpointData={checkpointData}
        setCheckpointData={setCheckpointData}
      />
      <div className="w-full flex items-center justify-end">
        <Buttons
          className="mt-4"
          label={'Save'}
          onClick={() => {
            saveAllCheckpointData(questionData, checkpointData, {
              authId: authId,
              email: email
            });
          }}
        />
      </div>
    </div>
  );
};

export default DemographicsBlock;
