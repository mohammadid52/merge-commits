import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import API, { graphqlOperation } from '@aws-amplify/api';

// import { reorder } from '../../../../../../../utilities/strings';
import * as customQueries from '../../../../../../../customGraphql/customQueries';

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

  const fetchCurricularCheckpoint = async () => {
    const result: any = await API.graphql(graphqlOperation(customQueries.getCurriculumCheckpoints, { id: curricularId }))
    const curricularCheckp: any = result.data?.getCurriculum?.checkpoints?.items;
    if (curricularCheckp.length > 0) {
      let checkpointList = curricularCheckp.map((item: any) => {
        return {
          id: item.checkpointID,
          commonCheckpointId: item.id,
          title: item?.checkpoint?.title,
          content: <CheckpointQueTable changeStep={changeStep} checkpointId={item.checkpointID} DeleteCheckpoint={DeleteCheckpoint} editCheckPoint={editCheckPoint} showActionIcons />
        }
      })
      setCheckPoints(checkpointList)
    }
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
                    <Buttons btnClass="mr-3" label="Add Existing Checkpoint" onClick={addExistingCheckpoint} />
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
