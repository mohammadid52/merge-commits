import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Fragment, useEffect, useState} from 'react';
import {useHistory} from 'react-router';

import {deleteCommonCheckpoint} from 'customGraphql/customMutations';
import {getCurriculumCheckpoints} from 'customGraphql/customQueries';

import Loader from '@components/Atoms/Loader';
import {RoomStatus} from 'API';
import Buttons from 'atoms/Buttons';
import DragableAccordion from 'atoms/DragableAccordion';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import PageLayout from 'layout/PageLayout';
import CheckpointQueTable from '../../../../LessonsBuilder/StepActionComponent/CheckPointSteps/CheckpointQueTable';

interface CheckpointListProps {
  curricularId: string;
  institutionId: string;
  status: RoomStatus;
}

const CheckpointList = (props: CheckpointListProps) => {
  const {curricularId, institutionId, status} = props;
  const history = useHistory();

  const [checkPoints, setCheckPoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const {userLanguage} = useGlobalContext();
  const {CHECKPOINTSDICT} = useDictionary();

  const createNewCheckpoint = () => {
    history.push(
      `/dashboard/manage-institutions/institution/${institutionId}/course-builder/${curricularId}/checkpoint/addNew`
    );
  };
  const addExistingCheckpoint = () => {
    history.push(
      `/dashboard/manage-institutions/institution/${institutionId}/course-builder/${curricularId}/checkpoint/addPrevious`
    );
  };
  const editCheckPoint = (id: string) => {
    history.push(
      `/dashboard/manage-institutions/institution/${institutionId}/course-builder/${curricularId}/checkpoint/edit/${id}`
    );
  };
  const changeStep = () => {
    // do something
  };
  const DeleteCheckpoint = async (checkpointId: string, checkpointList: any) => {
    const commonCheckpointId: string = [...checkpointList].find(
      (item: any) => item.id === checkpointId
    )?.commonCheckpointId;
    if (commonCheckpointId) {
      await API.graphql(
        graphqlOperation(deleteCommonCheckpoint, {
          input: {
            id: commonCheckpointId
          }
        })
      );
      const updatedList: any = [...checkpointList].filter(
        (item) => item.id !== checkpointId
      );
      setCheckPoints([...updatedList]);
    }
  };

  const fetchCurricularCheckpoint = async () => {
    setLoading(true);
    const result: any = await API.graphql(
      graphqlOperation(getCurriculumCheckpoints, {
        id: curricularId
      })
    );
    const curricularCheckp: any = result.data?.getCurriculum?.checkpoints?.items;
    if (curricularCheckp.length > 0) {
      let checkpointList = curricularCheckp.map((item: any) => {
        return {
          id: item.checkpointID,
          commonCheckpointId: item.id,
          title: item?.checkpoint?.title,
          content: (
            <CheckpointQueTable
              changeStep={changeStep}
              checkpointId={item.checkpointID}
              DeleteCheckpoint={(id) => DeleteCheckpoint(id, checkpointList)}
              editCheckPoint={editCheckPoint}
              showActionIcons
            />
          )
        };
      });
      setCheckPoints([...checkpointList]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCurricularCheckpoint();
  }, []);

  const isInactive = status === RoomStatus.INACTIVE;

  return (
    <div className="">
      <PageLayout
        type="inner"
        warning={
          isInactive
            ? 'This course is inactive. Adding demographics and information to this course has been disabled'
            : ''
        }
        extra={
          <div className="flex w-auto justify-end gap-4">
            <Buttons
              label={CHECKPOINTSDICT[userLanguage]['BUTTON']['ADDEXISTING']}
              onClick={addExistingCheckpoint}
              disabled={isInactive}
            />
            <Buttons
              label={CHECKPOINTSDICT[userLanguage]['BUTTON']['ADDNEW']}
              onClick={createNewCheckpoint}
              disabled={isInactive}
            />
          </div>
        }
        title={CHECKPOINTSDICT[userLanguage]['TITLE']}>
        {!loading ? (
          checkPoints && checkPoints.length > 0 ? (
            <Fragment>
              <div className="py-4">
                <DragableAccordion titleList={checkPoints} />
              </div>
              <div className="flex justify-center gap-4 m-auto">
                <Buttons
                  label={CHECKPOINTSDICT[userLanguage]['BUTTON']['ADDEXISTING']}
                  onClick={addExistingCheckpoint}
                />
                <Buttons
                  label={CHECKPOINTSDICT[userLanguage]['BUTTON']['ADDNEW']}
                  onClick={createNewCheckpoint}
                />
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <p className="text-medium  p-16 text-sm text-center">
                {CHECKPOINTSDICT[userLanguage]['INFO']}
              </p>
            </Fragment>
          )
        ) : (
          <div className="py-12 my-12 m-auto text-center">
            <Loader withText={CHECKPOINTSDICT[userLanguage]['FETCH']} animation />
          </div>
        )}
      </PageLayout>
    </div>
  );
};

export default CheckpointList;
