import useAuth from '@customHooks/useAuth';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import {
  DeleteUniversalLessonStudentDataInput,
  ModelUniversalLessonStudentDataConditionInput,
  UniversalLessonStudentData,
  UpdatePersonLessonsDataInput
} from 'API';
import Buttons from 'atoms/Buttons';
import {useGlobalContext} from 'contexts/GlobalContext';
import useStudentTimer from 'customHooks/timer';
import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {AiOutlineSave} from 'react-icons/ai';
import {useHistory} from 'react-router-dom';
import {getLocalStorageData} from 'utilities/localStorage';

interface SaveQuitProps {
  id?: string;
  feedback?: {
    like: string;
    text: string;
  };
  roomID: string;
  createJournalData?: () => any;
}

const SaveQuit = ({createJournalData}: SaveQuitProps) => {
  const {lessonState} = useGlobalContext();
  const history = useHistory();

  // ##################################################################### //
  // ################## LOGIC FOR RETURNING TO CLASSROOM ################# //
  // ##################################################################### //
  const getRoomData = getLocalStorageData('room_info');
  const [waiting, setWaiting] = useState<boolean>(null);
  const [safeToLeave, setSafeToLeave] = useState<any>(null);

  const {updateSurveyData, updateStudentLessonData} = useStudentTimer();

  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    setIsUpdated(lessonState.updated);
  }, [lessonState.updated]);

  const handleManualSave = async () => {
    if (isUpdated) {
      setWaiting(true);
      setSafeToLeave(false);
    } else {
      setWaiting(false);
      setSafeToLeave(true);

      try {
        if (lessonState?.lessonData?.type === 'survey') {
          updateSurveyData();
        } else if (lessonState?.lessonData?.type === 'lesson') {
          await updateStudentLessonData();
          await handleNotebookSave();
        }

        const id =
          lessonState.misc?.personLessonData?.data?.find(
            (_d: any) => _d.lessonID === lessonState?.lessonData?.id
          )?.id || '';

        updatePersonLessonsDataMutation
          .mutate({input: {id, isCompleted: true}})
          .then(() => {
            history.push(`/dashboard/classroom/${getRoomData.id}`);
            console.log('Successfully completed ' + lessonState?.lessonData?.type);
          })
          .catch((err) => {
            console.error('Error updating current lesson/survey complete status', err);
          });
      } catch (error) {
        console.error('error @ handleManualSave in SaveQuit.tsx', error);
      }
    }
  };

  const {onDemand} = useAuth();

  const {mutate} = useGraphqlMutation<
    {
      input: DeleteUniversalLessonStudentDataInput;
      condition?: ModelUniversalLessonStudentDataConditionInput;
    },
    UniversalLessonStudentData
  >('deleteUniversalLessonStudentData');

  const updatePersonLessonsDataMutation = useGraphqlMutation<
    {
      input: UpdatePersonLessonsDataInput;
    },
    UniversalLessonStudentData
  >('updatePersonLessonsData');

  const handleNotebookSave = () => {
    createJournalData && createJournalData();
    console.log('\x1b[33m *Saving notebook... \x1b[0m');

    // delete lessonData from record from graphql if student is self paced
    const lessonID = lessonState?.lessonData?.id;

    // if (onDemand && lessonID) {
    //   console.log("removing lesson from student's record");
    //   lessonState?.universalStudentDataID.forEach((_d: {id: string}) => {
    //     mutate({input: {id: _d.id}, condition: {lessonID: {eq: lessonID}}})
    //       .then((res) => {
    //         console.log("successfully removed lesson from student's record");
    //       })
    //       .catch((err) => {
    //         console.error("error removing lesson from student's record", err);
    //       });
    //   });

    //   console.log('\x1b[33m *Removed lesson record... \x1b[0m');
    // }
  };

  useEffect(() => {
    if (!lessonState.updated) {
      if (waiting === true && safeToLeave === false) {
        setWaiting(false);
        setSafeToLeave(true);
      } else {
        setWaiting(null);
        setSafeToLeave(null);
      }
    }
  }, [lessonState.updated]);

  // useEffect(() => {
  //   // console.log('safeToLeave State - ', safeToLeave);
  //   if (safeToLeave === true && getRoomData && getRoomData.id) {
  //     history.push(`/dashboard/classroom/${getRoomData.id}`);
  //   }
  // }, [safeToLeave]);

  return (
    <>
      <div className={''}>
        <Buttons
          dataCy="save-lesson"
          label={waiting ? 'Saving your data...' : 'Save and Go to Classroom'}
          Icon={AiOutlineSave}
          btnClass="w-full"
          onClick={handleManualSave}></Buttons>
      </div>
    </>
  );
};

export default SaveQuit;
