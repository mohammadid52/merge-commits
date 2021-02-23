import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
// import API, { graphqlOperation } from '@aws-amplify/api';

// import { reorder } from '../../../../../../../utilities/strings';

import PageWrapper from '../../../../../../Atoms/PageWrapper';
import DragableAccordion from '../../../../../../Atoms/DragableAccordion';
import Buttons from '../../../../../../Atoms/Buttons';
import CheckpointQueTable from '../../../../LessonsBuilder/StepActionComponent/CheckPointSteps/CheckpointQueTable';

interface CheckpointListProps {
  curricularId: string
}

const CheckpointList = (props: CheckpointListProps) => {
  const { curricularId } = props;
  const history = useHistory();

  const [checkPoints, setCheckPoints] = useState([]);
  const [loading, setLoading] = useState(false);

  const createNewCheckpoint = () => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/checkpoint/addNew`)
  }
  const addExistingCheckpoint = () => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/checkpoint/addPrevious`)
  }
  const editCheckPoint = (id: string) => {
    history.push(`/dashboard/manage-institutions/curricular/${curricularId}/checkpoint/edit?id=${id}`)
  }
  const changeStep = () => {

  }
  const DeleteCheckpoint = () => {

  }

  const fetchCurricularCheckpoint = () => {
    const checkpointList: any = [
      { id: '1', title: 'Checkpoint 1' },
      { id: '2', title: 'Checkpoint 2' },
      { id: '3', title: 'Checkpoint 3' },
    ];
    const updatedList = checkpointList.map((item: any) => {
      const newItem = {
        ...item,
        content: <CheckpointQueTable changeStep={changeStep} checkpointId={item.id} DeleteCheckpoint={DeleteCheckpoint} editCheckPoint={editCheckPoint} showActionIcons />
      }
      return newItem;
    })
    setCheckPoints(updatedList)
  }

  useEffect(() => {
    fetchCurricularCheckpoint();
  }, [])
  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">CURRICULAR CHECKPOINTS</h3>
          {
            !loading ? ((checkPoints && checkPoints.length > 0) ? (
              <Fragment>
                <div className="py-4">
                  <DragableAccordion titleList={checkPoints} onDragEnd={() => console.log('onDragEnd')} />
                  {/* <DragableAccordion titleList={checkPoints} onDragEnd={onDragEnd} showEdit onItemEdit={editLearningObj} /> */}
                </div>
                <div className="flex justify-center w-9/10 m-auto">
                  <Buttons btnClass="mr-3" label="Add Existing Checkpoint" onClick={addExistingCheckpoint} />
                  <Buttons btnClass="ml-3" label="Add New Checkpoint" onClick={createNewCheckpoint} />
                </div>
              </Fragment>
            ) : (
                <Fragment>
                  <div className="flex justify-center mt-8">
                    <Buttons btnClass="mx-4" label="Add new Checkpoint" onClick={createNewCheckpoint} />
                  </div>
                  <p className="text-center p-16">  This curricular does not have any checkpoints yet. Please create a new one.</p>
                </Fragment>)) : (
                <div className="py-12 my-12 m-auto text-center">Fetching Data Please wait...</div>
              )}
        </PageWrapper>
      </div>
    </div>
  )
}

export default CheckpointList
