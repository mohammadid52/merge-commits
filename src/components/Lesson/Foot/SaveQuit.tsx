import {StudentPageInput} from '@interfaces/UniversalLessonInterfaces';
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

const SaveQuit = ({invokeRequiredField}: SaveQuitProps) => {
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

  const PAGES = lessonState.lessonData.lessonPlan;

  const checkAllFields = () => {
    if (PAGES) {
      const thisPageData = lessonState?.studentData || [];

      const thisPageRequired = lessonState?.requiredInputs?.flat() || [];

      if (thisPageData && thisPageData.length > 0) {
        const areAnyEmpty = thisPageData.filter((input: StudentPageInput) => {
          if (thisPageRequired.includes(input.domID) && input.input[0] === '') {
            return input;
          }
        });

        if (areAnyEmpty.length > 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const handleManualSave = async () => {
    if (checkAllFields()) {
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
    } else {
      invokeRequiredField();
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
      <div className={'w-auto'}>
        <Buttons
          dataCy="save-lesson"
          // disabled={!canContinue}
          label={waiting ? 'Saving your data...' : 'Save Survey Results'}
          Icon={BiSave}
          btnClass="w-full"
          onClick={handleManualSave}></Buttons>
      </div>
    </>
  );
};

export default SaveQuit;
