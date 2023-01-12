import React, {Fragment, useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';

// import { reorder } from 'utilities/strings';
import * as customQueries from 'customGraphql/customQueries';
import * as customMutations from 'customGraphql/customMutations';

import PageWrapper from 'atoms/PageWrapper';
import DragableAccordion from 'atoms/DragableAccordion';
import Buttons from 'atoms/Buttons';
import CheckpointQueTable from '../../../../LessonsBuilder/StepActionComponent/CheckPointSteps/CheckpointQueTable';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import Loader from '@components/Atoms/Loader';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import {RoomStatus} from 'API';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';

interface CheckpointListProps {
  curricularId: string;
  institutionId: string;
  status: RoomStatus;
}

const CheckpointList = (props: CheckpointListProps) => {
  const {curricularId, institutionId, status} = props;
  const history = useHistory();

  const [checkPoints, setCheckPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const {clientKey, userLanguage, theme} = useContext(GlobalContext);
  const {CHECKPOINTSDICT, BreadcrumsTitles} = useDictionary(clientKey);

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
  const changeStep = () => {};
  const DeleteCheckpoint = async (checkpointId: string, checkpointList: any) => {
    const commonCheckpointId: string = [...checkpointList].find(
      (item: any) => item.id === checkpointId
    )?.commonCheckpointId;
    if (commonCheckpointId) {
      const result: any = await API.graphql(
        graphqlOperation(customMutations.deleteCommonCheckpoint, {
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
      graphqlOperation(customQueries.getCurriculumCheckpoints, {id: curricularId})
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
    <div className="flex m-auto justify-center">
      <div className="">
        <PageWrapper defaultClass=" ">
          <SectionTitleV3
            withButton={
              <div className="flex w-auto justify-end gap-x-4">
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
            title={CHECKPOINTSDICT[userLanguage]['TITLE']}
          />

          {!loading ? (
            checkPoints && checkPoints.length > 0 ? (
              <Fragment>
                <div className="py-4">
                  <DragableAccordion titleList={checkPoints} />
                </div>
                <div className="flex justify-center w-9/10 m-auto">
                  <Buttons
                    btnClass="mr-3"
                    label={CHECKPOINTSDICT[userLanguage]['BUTTON']['ADDEXISTING']}
                    onClick={addExistingCheckpoint}
                  />
                  <Buttons
                    btnClass="ml-3"
                    label={CHECKPOINTSDICT[userLanguage]['BUTTON']['ADDNEW']}
                    onClick={createNewCheckpoint}
                  />
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <p className="text-gray-500 p-16 text-sm text-center">
                  {CHECKPOINTSDICT[userLanguage]['INFO']}
                </p>
              </Fragment>
            )
          ) : (
            <div className="py-12 my-12 m-auto text-center">
              <Loader
                withText={CHECKPOINTSDICT[userLanguage]['FETCH']}
                animation
                className="text-gray-500"
              />
            </div>
          )}

          <AnimatedContainer show={isInactive}>
            {isInactive && (
              <>
                <hr />
                <p className="mt-4 text-gray-500 text-sm text-center">
                  This course is inactive. Adding demographics and information to this
                  course has been disabled
                </p>
              </>
            )}
          </AnimatedContainer>
        </PageWrapper>
      </div>
    </div>
  );
};

export default CheckpointList;
