import React, { Fragment, useEffect, useState } from 'react'
import API, { graphqlOperation } from '@aws-amplify/api';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

import * as queries from '../../../../../../graphql/queries';
import { createFilterToFetchSpecificItemsOnly } from '../../../../../../utilities/strings';
import Buttons from '../../../../../Atoms/Buttons';


interface CheckPointContentProps {
  changeStep: (step: string) => void
  checkpointId: string
  showActionIcons?: boolean
  DeleteCheckpoint?: (id: string) => void
  editCheckPoint?: (id: string) => void
}

const CheckpointQueTable = (props: CheckPointContentProps) => {
  const { changeStep, checkpointId, showActionIcons, DeleteCheckpoint, editCheckPoint } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [questionsList, setQuestionsList] = useState([]);

  const fetchCheckpointQuestions = async () => {
    try {
      setLoading(true);
      const fetchCheckpointsData: any = await API.graphql(graphqlOperation(queries.getCheckpoint, {
        id: checkpointId
      })
      );
      if (!fetchCheckpointsData) {
        setError(true);
        throw new Error('fail!');
      } else {
        const checkpointQuestions = fetchCheckpointsData.data?.getCheckpoint.questions?.items;
        const quesionsListIds = checkpointQuestions.map((item: { questionID: string }) => item.questionID);
        if (quesionsListIds?.length > 0) {

          const results: any = await API.graphql(graphqlOperation(queries.listQuestions, {
            filter: { ...createFilterToFetchSpecificItemsOnly(quesionsListIds, 'id') }
          }));
          const questionsList: any = results.data.listQuestions.items

          setQuestionsList(questionsList);
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
        {/* <span className="w-6 h-6 flex items-center cursor-pointer mr-4" onClick={editCurrentCheckp}>
          <IconContext.Provider value={{ size: '1.5rem', color: '#667eea' }}>
            <FaEdit />
          </IconContext.Provider>
        </span>
        <span className="w-6 h-6 flex items-center cursor-pointer ml-4" onClick={() => DeleteCheckpoint(checkpointId)}>
          <IconContext.Provider value={{ size: '1.5rem', color: '#B22222' }}>
            <FaTrashAlt />
          </IconContext.Provider>
        </span> */}
        <div className="flex justify-end w-6/10 items-center">
          <Buttons btnClass="py-1 px-4 text-xs mr-2 text-indigo-600 border-indigo-600 hover:bg-gray-100  hover:text-indigo-500" label="Edit Checkpoint" onClick={editCurrentCheckp} transparent />
          <Buttons btnClass="py-1 px-4 text-xs ml-2 text-red-600 border-red-600 hover:bg-gray-100 hover:text-red-500" label="Remove Checkpoint" onClick={() => DeleteCheckpoint(checkpointId)} transparent />

        </div>
      </div>}
      <div className='mb-4'>
        <div className="flex justify-between w-9/10 px-8 py-4 mx-auto whitespace-no-wrap border-b border-gray-200">
          <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>No.</span>
          </div>
          <div className="w-7/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>Question</span>
          </div>
          <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
            <span>Type</span>
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
                    <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{item.type}</div>
                    {/* <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center whitespace-normal">{item.language}</div> */}
                  </div>
                )) : (
                    <div className="py-12 my-6 text-center">
                      <p> This checkpoint does not have any questions</p>
                    </div>
                  )}
              </Fragment>) : (
                  <div className="py-12 my-6 text-center">
                    <p> Error while fetching checkpoint questions please try later...</p>
                  </div>
                )}
            </Fragment>
          ) : (
              <div className="py-12 my-6 text-center text-gray-700">
                <p> Fetching checkpoint questions please wait...</p>
              </div>
            )}

        </div>
      </div>
    </Fragment>
  );

}

export default CheckpointQueTable
