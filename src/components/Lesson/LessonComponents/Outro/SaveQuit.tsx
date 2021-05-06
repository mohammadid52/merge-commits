import React, {useContext, useEffect, useState} from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import {LessonContext} from '../../../../contexts/LessonContext';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as customMutations from '../../../../customGraphql/customMutations';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import Popup from '../../../General/Popup';
import {useOutsideAlerter} from '../../../General/hooks/outsideAlerter';
import {Auth} from '@aws-amplify/auth';
import {FiLogOut} from 'react-icons/all';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {AiOutlineSave} from 'react-icons/ai';

interface SaveQuitProps {
  id?: string;
  feedback?: {
    like: string;
    text: string;
  };
  roomID: string;
}

const SaveQuit = (props: SaveQuitProps) => {
  const {state, dispatch, theme} = useContext(LessonContext);
  const {state: globalStateAccess} = useContext(GlobalContext);
  const {id, feedback, roomID: roomIDFromProps} = props;
  const history = useHistory();
  const {visible, setVisible, ref} = useOutsideAlerter(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const roomID = globalStateAccess.activeRoom || roomIDFromProps;
  const [checkpointIdKeys, setCheckpointIdKeys] = useState<string[]>([]);
  const [nrSaves, setNrSaves] = useState<number>(0);

  useEffect(() => {
    let checkpointIdKeysState = Object.keys(state.questionData); // doFirst, checkpoint_1
    if (checkpointIdKeysState.length > 0) {
      setCheckpointIdKeys(checkpointIdKeysState);
    }
  }, [state.questionData]);

  useEffect(() => {
    if (isSaving) {
      if (nrSaves === checkpointIdKeys.length) {
        if (roomID) {
          setTimeout(
            () => (window.location.href = `/dashboard/classroom/${roomID}`),
            50
          );
        } else {
          history.push('/dashboard/home');
        }
      }
    }
  }, [nrSaves, checkpointIdKeys]);

  /**
   * QUESTION SAVING
   */

  /**
   * GET or CREATE QUESTION DATA
   */
  const createQuestionData = async (responseObj: any, saveNr: number) => {
    try {
      const newQuestionData = await API.graphql(
        graphqlOperation(customMutations.createQuestionData, {input: responseObj})
      );
    } catch (err) {
      console.error(err);
    } finally {
      setNrSaves(saveNr + 1);
    }
  };

  const handleCreateQuestionData = async () => {
    let studentID: string;
    let studentAuthID: string;

    await Auth.currentAuthenticatedUser().then((user) => {
      studentID = user.attributes.email;
      studentAuthID = user.attributes.sub;
    });

    if (checkpointIdKeys.length > 0) {
      await checkpointIdKeys.reduce(async (_: any, key: string, idx: number) => {
        let responseObject = {
          syllabusLessonID: state.syllabusLessonID,
          checkpointID: key,
          componentType: state.data.lesson.type,
          lessonID: state.data.lesson.id,
          authID: studentAuthID,
          email: studentID,
          responseObject: state.questionData[key],
        };
        await createQuestionData(responseObject, idx);
      }, null);
    } else {
      setTimeout(
        () => (window.location.href = `/dashboard/classroom/${roomID}`),
        50
      );
    }

  };

  const handleManualSave = () => {
    if (!isSaving) {
      setIsSaving(true);
      if (state.data.lesson.type === 'lesson') {
        dispatch({type: 'INCREMENT_SAVE_COUNT'});
      } else {
        handleCreateQuestionData();
      }
    }
  };

  const handlePopup = () => {
    setVisible((prevState: any) => !prevState);
  };

  return (
    <>
      {alert ? (
        <div
          className={`${alert ? 'absolute z-100 top-0' : 'hidden'}`}
          onClick={handlePopup}>
          <Popup
            alert={visible}
            setAlert={setVisible}
            header="You have completed a lesson!"
            button1="Save your lesson"
            svg="smile"
            handleButton1={handleManualSave}
            fill="screen"
          />
        </div>
      ) : null}

      <div className="w-full flex flex-col my-24">
        <button
          type="submit"
          className={`self-center w-auto px-4 h-10 font-semibold bg-blueberry hover:bg-blue-500 hover:text-underline text-white flex justify-center items-center rounded-full my-4`}
          onClick={handlePopup}>
          <IconContext.Provider
            value={{className: 'w-auto mr-2', style: {cursor: 'pointer'}}}>
            <AiOutlineSave size={24} />
          </IconContext.Provider>
          <div>Save and Go to Dashboard</div>
        </button>
      </div>
    </>
  );
};

export default SaveQuit;
