import Buttons from 'atoms/Buttons';
import {useGlobalContext} from 'contexts/GlobalContext';
import React, {useEffect, useState} from 'react';
import {BiSave} from 'react-icons/bi';

interface SaveQuitProps {
  id?: string;
  feedback?: {
    like: string;
    text: string;
  };
  roomID: string;
  canContinue: boolean;
  createJournalData?: () => any;
  invokeRequiredField?: () => any;
}

const SaveQuit = ({canContinue, invokeRequiredField}: SaveQuitProps) => {
  const {lessonState, lessonDispatch} = useGlobalContext();

  // ##################################################################### //
  // ################## LOGIC FOR RETURNING TO CLASSROOM ################# //
  // ##################################################################### //

  const [waiting, setWaiting] = useState<boolean>(null);
  const [safeToLeave, setSafeToLeave] = useState<any>(null);

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

  const goToThatRequiredElement = (domID: string) => {
    const element = document.getElementById(domID);
    if (element) {
      element.scrollIntoView({behavior: 'smooth'});
    }
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
          disabled={!canContinue}
          label={waiting ? 'Saving your data...' : 'Save and Go to Classroom'}
          Icon={BiSave}
          btnClass="w-full"
          iconBeforeLabel
          onClick={
            canContinue ? handleManualSave : () => invokeRequiredField()
          }></Buttons>
      </div>
    </>
  );
};

export default SaveQuit;
