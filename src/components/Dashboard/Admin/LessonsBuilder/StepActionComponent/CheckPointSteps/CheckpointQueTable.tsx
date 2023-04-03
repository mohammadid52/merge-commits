import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import Buttons from 'atoms/Buttons';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {Fragment, useEffect, useState} from 'react';
import {getTypeString} from 'utilities/strings';

interface CheckPointContentProps {
  changeStep?: (step?: string) => void;
  checkpointId: string;
  showActionIcons?: boolean;
  DeleteCheckpoint?: (id: string) => void;
  editCheckPoint?: (id: string) => void;
}

const CheckpointQueTable = (props: CheckPointContentProps) => {
  const {changeStep, checkpointId, showActionIcons, DeleteCheckpoint, editCheckPoint} =
    props;

  const {CheckpointQueTableDict, userLanguage} = useDictionary();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [questionsList, setQuestionsList] = useState<any[]>([]);

  const fetchCheckpointQuestions = async () => {
    try {
      setLoading(true);
      const fetchCheckpointsData: any = await API.graphql(
        graphqlOperation(customQueries.getCheckpointDetails, {
          id: checkpointId
        })
      );
      let questionSequence = fetchCheckpointsData.data?.getCheckpoint.questionSeq;

      if (!fetchCheckpointsData) {
        setError(true);
        throw new Error('fail!');
      } else {
        const checkpointQuestions =
          fetchCheckpointsData.data?.getCheckpoint?.questions?.items;
        checkpointQuestions.map((item: {questionID: string}) => item.questionID);
        if (checkpointQuestions?.length > 0) {
          const questionsList: any = checkpointQuestions.map(
            (item: any) => item.question
          );
          let list = questionSequence
            ? questionsList
                .map((t: any) => {
                  let index = questionSequence.indexOf(t.id);
                  return {...t, index};
                })
                .sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
            : questionsList;

          setQuestionsList(list);
        } else {
          setQuestionsList([]);
        }
      }
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.error(error);
    }
  };
  const editCurrentCheckp = () => {
    editCheckPoint?.(checkpointId);
    changeStep?.('EditCheckPoint');
  };

  useEffect(() => {
    fetchCheckpointQuestions();
  }, []);

  return (
    <Fragment>
      {showActionIcons && (
        <div className="w-full mx-auto my-4 flex justify-end">
          <div className="flex justify-end w-6/10 items-center">
            <Buttons
              label={CheckpointQueTableDict[userLanguage]['BUTTON']['EDIT']}
              onClick={editCurrentCheckp}
              transparent
            />
            <Buttons
              label={CheckpointQueTableDict[userLanguage]['BUTTON']['REMOVE']}
              onClick={() => DeleteCheckpoint?.(checkpointId)}
              transparent
            />
          </div>
        </div>
      )}
      <div className="mb-4">
        <div className="flex justify-between w-full lg:w-9/10 px-4 lg:px-8 py-4 mx-auto whitespace-nowrap border-b-0 border-light">
          <div className="w-1/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
            <span>{CheckpointQueTableDict[userLanguage]['NO']}</span>
          </div>
          <div className="w-7/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
            <span>{CheckpointQueTableDict[userLanguage]['QUESTION']}</span>
          </div>
          <div className="w-2/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
            <span>{CheckpointQueTableDict[userLanguage]['TYPE']}</span>
          </div>
          {/* <div className="w-2/10 px-8 py-3 bg-lightest text-left text-xs leading-4 font-medium text-medium  uppercase tracking-wider">
            <span>Language</span>
          </div> */}
        </div>
        <div className="w-9/10 m-auto">
          {!loading ? (
            <Fragment>
              {!error ? (
                <Fragment>
                  {questionsList?.length ? (
                    questionsList.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex justify-between w-full px-8 py-4 whitespace-nowrap border-b-0 border-light">
                        <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">
                          {index + 1}.
                        </div>
                        <div className="flex w-7/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal">
                          {' '}
                          {item.question}{' '}
                        </div>
                        <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">
                          {item.type ? getTypeString(item.type) : '--'}
                        </div>
                        {/* <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{item.language}</div> */}
                      </div>
                    ))
                  ) : (
                    <div className="py-12 my-6 text-center">
                      <p>
                        {' '}
                        {CheckpointQueTableDict[userLanguage]['NOQUESTIONCHECKPOINT']}
                      </p>
                    </div>
                  )}
                </Fragment>
              ) : (
                <div className="py-12 my-6 text-center">
                  <p>{CheckpointQueTableDict[userLanguage]['FETCHERR']} </p>
                </div>
              )}
            </Fragment>
          ) : (
            <div className="py-12 my-6 text-center text-dark  ">
              <p> {CheckpointQueTableDict[userLanguage]['FETCHING']}</p>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default CheckpointQueTable;
