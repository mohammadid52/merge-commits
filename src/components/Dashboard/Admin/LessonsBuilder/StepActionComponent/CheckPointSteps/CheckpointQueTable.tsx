import React, { Fragment, useEffect, useState, useContext } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api';

import * as queries from '../../../../../../graphql/queries';
import * as customQueries from '../../../../../../customGraphql/customQueries';

import { createFilterToFetchSpecificItemsOnly } from '../../../../../../utilities/strings';
import Buttons from '../../../../../Atoms/Buttons';
import { getTypeString } from '../../../../../../utilities/strings';
import { getAsset } from '../../../../../../assets';
import { GlobalContext } from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';

interface CheckPointContentProps {
  changeStep?: (step?: string) => void
  checkpointId: string
  showActionIcons?: boolean
  DeleteCheckpoint?: (id: string) => void
  editCheckPoint?: (id: string) => void
}

const CheckpointQueTable = (props: CheckPointContentProps) => {
  const { changeStep, checkpointId, showActionIcons, DeleteCheckpoint, editCheckPoint } = props;

  const { theme, clientKey,userLanguage } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const { CheckpointQueTableDict ,BreadcrumsTitles } = useDictionary(clientKey);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [questionsList, setQuestionsList] = useState([]);

  const fetchCheckpointQuestions = async () => {
    try {
      setLoading(true);
      const fetchCheckpointsData: any = await API.graphql(graphqlOperation(customQueries.getCheckpointDetails, {
        id: checkpointId
      }));
      let questionSequence: any = await API.graphql(graphqlOperation(queries.getCSequences,
        { id: `Ch_Ques_${checkpointId}` }));
      questionSequence = questionSequence?.data.getCSequences?.sequence || []
      if (!fetchCheckpointsData) {
        setError(true);
        throw new Error('fail!');
      } else {
        const checkpointQuestions = fetchCheckpointsData.data?.getCheckpoint?.questions?.items;
        const quesionsListIds = checkpointQuestions.map((item: { questionID: string }) => item.questionID);
        if (checkpointQuestions?.length > 0) {
          const questionsList: any = checkpointQuestions.map((item: any) => item.question);
          let list = questionsList.map((t: any) => {
            let index = questionSequence.indexOf(t.id)
            return { ...t, index }
          }).sort((a: any, b: any) => (a.index > b.index ? 1 : -1));
          setQuestionsList(list);
        }
        else {
          setQuestionsList([])
        }

      }
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
      console.error(error);
    }
  }
  const editCurrentCheckp = () => {
    editCheckPoint(checkpointId);
    changeStep('EditCheckPoint');
  }

  useEffect(() => {
    fetchCheckpointQuestions();
  }, []);

  return (
    <Fragment>
      {showActionIcons && <div className="w-full mx-auto my-4 flex justify-end">
        <div className="flex justify-end w-6/10 items-center">
          <Buttons btnClass={`py-1 px-4 text-xs mr-2 hover:bg-gray-100 ${theme.btnTransparent[themeColor]}`} label={CheckpointQueTableDict[userLanguage]['BUTTON']['EDIT']} onClick={editCurrentCheckp} transparent />
          <Buttons btnClass="py-1 px-4 text-xs ml-2 text-red-600 border-red-600 hover:bg-gray-100 hover:text-red-500" label={CheckpointQueTableDict[userLanguage]['BUTTON']['REMOVE']} onClick={() => DeleteCheckpoint(checkpointId)} transparent />
        </div>
      </div>}
      <div className='mb-4'>
        <div className="flex justify-between w-9/10 px-8 py-4 mx-auto whitespace-no-wrap border-b border-gray-200">
          <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>{CheckpointQueTableDict[userLanguage]['NO']}</span>
          </div>
          <div className="w-7/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>{CheckpointQueTableDict[userLanguage]['QUESTION']}</span>
          </div>
          <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>{CheckpointQueTableDict[userLanguage]['TYPE']}</span>
          </div>
          {/* <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>Language</span>
          </div> */}
        </div>
        <div className="w-9/10 m-auto">
          {!loading ? (
            <Fragment>
              {!error ? (<Fragment>
                {questionsList?.length ? questionsList.map((item, index) => (
                  <div key={item.id} className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">
                      {index + 1}.
                    </div>
                    <div className="flex w-7/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal"> {item.question} </div>
                    <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{item.type ? getTypeString(item.type) : '--'}</div>
                    {/* <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{item.language}</div> */}
                  </div>
                )) : (
                    <div className="py-12 my-6 text-center">
                      <p> {CheckpointQueTableDict[userLanguage]['NOQUESTIONCHECKPOINT']}</p>
                    </div>
                  )}
              </Fragment>) : (
                  <div className="py-12 my-6 text-center">
                    <p>{CheckpointQueTableDict[userLanguage]['FETCHERR']} </p>
                  </div>
                )}
            </Fragment>
          ) : (
              <div className="py-12 my-6 text-center text-gray-700">
                <p> {CheckpointQueTableDict[userLanguage]['FETCHING']}</p>
              </div>
            )}

        </div>
      </div>
    </Fragment>
  );

}

export default CheckpointQueTable
