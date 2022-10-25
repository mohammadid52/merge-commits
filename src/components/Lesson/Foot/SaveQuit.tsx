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
import React, {useEffect, useState} from 'react';
import {BiSave} from 'react-icons/bi';
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
  const {lessonState, lessonDispatch} = useGlobalContext();
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

      setLeaveModalVisible(true);
      // ---- IMPORTANT ---- //
      // JSX of modal is on LessonHeaderBar.tsx file
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

  const setLeaveModalVisible = (updatedState: boolean) => {
    lessonDispatch({type: 'SET_LEAVE_MODAL_VISIBLE_STATE', payload: updatedState});
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

  return (
    <>
      <div className={''}>
        <Buttons
          dataCy="save-lesson"
          label={waiting ? 'Saving your data...' : 'Save and Go to Classroom'}
          Icon={BiSave}
          btnClass="w-full"
          iconBeforeLabel
          onClick={handleManualSave}></Buttons>
      </div>
    </>
  );
};

export default SaveQuit;
