import React, { useContext, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { LessonContext } from '../../../../contexts/LessonContext';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../../../../customGraphql/customMutations';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import Popup from '../../../General/Popup';
import { useOutsideAlerter } from '../../../General/hooks/outsideAlerter';
import { Auth } from '@aws-amplify/auth';

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

      <div className="w-full flex flex-col mt-4">
        <button
          type="submit"
          className={`self-center w-auto px-3 h-8 bg-yellow-500 text-gray-900 font-bold flex justify-center items-center rounded-xl mt-4 ${theme.elem.text}`}
          onClick={handleClick}>
          Save and Go to Dashboard
        </button>
      </div>
    </>
  );
};

export default SaveQuit;
