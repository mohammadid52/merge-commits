import React, { useContext, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { LessonContext } from '../../../../contexts/LessonContext';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../../../../customGraphql/customMutations';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import Popup from '../../../General/Popup';
import { useOutsideAlerter } from '../../../General/hooks/outsideAlerter';
import { Auth } from '@aws-amplify/auth';
import { FiLogOut } from 'react-icons/all';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineSave } from 'react-icons/ai';

interface SaveQuitProps {
  id?: string;
  feedback?: {
    like: string;
    text: string;
  };
}

const SaveQuit = (props: SaveQuitProps) => {
  const { state, dispatch, theme } = useContext(LessonContext);
  const { globalStateAccess } = useContext(GlobalContext);
  const { id, feedback } = props;
  const history = useHistory();
  const { visible, setVisible, ref } = useOutsideAlerter(false);

  /**
   * QUESTION SAVING
   */


  /**
   * GET or CREATE QUESTION DATA
   */
  const createQuestionData = async (responseObj: any) => {
    try {
      const newQuestionData = await API.graphql(
        graphqlOperation(customMutations.createQuestionData, { input: responseObj }),
      );
    } catch (err) {
      console.error(err);
    } finally {
      handleClick();
      history.push('/dashboard');
    }
  };

  const handleCreateQuestionData = async () => {
    let studentID: string;
    let studentAuthID: string;

    await Auth.currentAuthenticatedUser().then((user) => {
      studentID = user.attributes.email;
      studentAuthID = user.attributes.sub;
    });

    if (typeof state.questionData === 'object') {
      let checkpointIdKeys = Object.keys(state.questionData); // doFirst, checkpoint_1
      await checkpointIdKeys.reduce((_: any, key: string) => {
        let responseObject = {
          syllabusLessonID: state.syllabusLessonID,
          checkpointID: key,
          componentType: state.data.lesson.type,
          lessonID: state.data.lesson.id,
          authID: studentAuthID,
          email: studentID,
          responseObject: state.questionData[key],
        };

        createQuestionData(responseObject);
      }, null);
    }


  };

  const handleClick = () => {
    setVisible((prevState: any) => !prevState);
  };

  return (
    <>
      {alert ? (
        <div className={`${alert ? 'absolute z-100 top-0' : 'hidden'}`} onClick={handleClick}>
          <Popup
            alert={visible}
            setAlert={setVisible}
            header="You have completed a lesson!"
            button1="Save your lesson"
            svg='smile'
            handleButton1={handleCreateQuestionData}
            fill='screen'
          />
        </div>
      ) : null}

      <div className="w-full flex flex-col my-4">
        <button
          type="submit"
          className={`self-center w-auto px-4 h-10 font-semibold bg-blueberry hover:bg-blue-500 hover:text-underline text-white flex justify-center items-center rounded-full my-4`}
          onClick={handleClick}>
          <IconContext.Provider value={{ className: 'w-auto mr-2', style: { cursor: 'pointer' } }}>
            <AiOutlineSave size={24}/>
          </IconContext.Provider>
          <div>Save and Go to Dashboard</div>
        </button>
      </div>
    </>
  );
};

export default SaveQuit;
