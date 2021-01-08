import React, { useContext, useState } from 'react';
// import { IconContext } from 'react-icons/lib/esm/iconContext';
// import { FaRegSave, FaHome } from 'react-icons/fa';
// import { AiOutlineSave, AiOutlineHome } from 'react-icons/ai';
import { NavLink, useHistory } from 'react-router-dom';
import { LessonContext } from '../../../../contexts/LessonContext';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../../../../customGraphql/customMutations';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import Popup from '../../../General/Popup';
import { useOutsideAlerter } from '../../../General/hooks/outsideAlerter';

interface SaveQuitProps {
  id: string;
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
  // the bottom is from 'LessonHeaderBar.tsx'
  // const { theme, state, dispatch } = useContext(LessonContext);
  // const handleSave = () => {
  //     if ( state.unsavedChanges ) {
  //         if ( !state.firstSave ) {
  //             createClassroomData()
  //         }

  //         if ( state.firstSave ) {
  //             updateClassroomData()
  //         }
  //     }
  // }

  const updateStudentData = async () => {
    let lessonProgress = state.pages[state.lessonProgress].stage === '' ? 'intro' : state.pages[state.lessonProgress].stage;

    let currentLocation = state.pages[state.currentPage].stage === '' ? 'intro' : state.pages[state.currentPage].stage;

    // console.log('thisone', state )

    let data = {
      id: state.studentDataID,
      lessonProgress: lessonProgress,
      currentLocation: currentLocation,
      status: state.studentStatus,
      saveType: 'finalSave',
      classroomID: state.classroomID,
      studentID: state.studentUsername,
      studentAuthID: state.studentAuthID,
      warmupData: state.componentState.story ? state.componentState.story : null,
      corelessonData: state.componentState.lyrics ? state.componentState.lyrics : null,
      activityData: state.componentState.poem ? state.componentState.poem : null
    }

    // console.log('update', data);

    try {
      const dataObject: any = await API.graphql(
        graphqlOperation(customMutations.updateStudentData, { input: data })
      );
      // console.log(dataObject)
      dispatch({ type: 'SAVED_CHANGES' });
      // console.log('state', state)
    } catch (error) {
      console.error(error);
    }
  };

  const updateStudentProfile = async () => {
    let updatedStudent = {
      id: globalStateAccess.user.id,
      authId: globalStateAccess.user.authId,
      email: globalStateAccess.user.email,
      onBoardSurvey: true,
    };

    // console.log(updatedStudent, 'updatedSurvey');

    try {
      const updatedStudentData: any = await API.graphql(
        graphqlOperation(customMutations.updateSurveyStatus, { input: updatedStudent })
      );
      // console.log(updatedStudentData);
    } catch (err) {
      console.error(err);
    }
  };

  const saveQuestionData = async (responseObj: any) => {
    let questiondDataObject = {
      classroomID: '1',
      componentType: 'checkpoint',
      lessonID: state.data.lesson.id,
      authID: state.studentAuthID,
      email: state.studentUsername,
      responseObject: responseObj,
    };

    try {
      const questionData = await API.graphql(
        graphqlOperation(customMutations.createQuestionData, { input: questiondDataObject })
      );
      console.log(questionData, 'questionData');
    } catch (err) {
      console.error(err);
    }
  };

  const saveLessonFeedback = async () => {
    let feedbackInput = {
      classroomID: '1',
      liked: feedback.like,
      comment: feedback.text,
    };

    try {
      const feedbackData = await API.graphql(
        graphqlOperation(customMutations.createFeedback, { input: feedbackInput })
      );
      // console.log(feedbackData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (typeof state.questionData === 'object') {
      let keys = Object.keys(state.questionData); // doFirst, checkpoint_1

      await keys.reduce((_:any, key: string)=>{
        const responseObject = state.questionData[key];

          saveQuestionData(responseObject);

      },null)

      if (typeof feedback !== 'undefined') {
        if (feedback?.like !== '' || feedback?.text !== '') {
          await saveLessonFeedback();
        }
      }

      if (id === 'on-boarding-survey-1') {
        await updateStudentProfile();
      }

      await updateStudentData();

      history.push('/dashboard');
    }
    handleClick
  };

  const handleClick = () => {
    setVisible((prevState: any) => !prevState)
  }

  return (
    <>
      {
        (alert)
          ? (
            <div className={`${alert ? 'absolute z-100 top-0' : 'hidden'}`} onClick={handleClick}>
              <Popup
                alert={visible}
                setAlert={setVisible}
                header='You have completed a lesson!'
                button1='Save your lesson'
                svg='smile'
                handleButton1={handleSave}
                fill='screen'
              />
            </div>
          )
          :
          null
      }

      <div className='w-full flex flex-col mt-4'>
        <button
          type='submit'
          className={`self-center w-auto px-3 h-8 bg-yellow-500 text-gray-900 font-bold flex justify-center items-center rounded-xl mt-4 ${theme.elem.text}`}
          onClick={handleClick}>
          Save and Go to Dashboard
      </button>
      </div>
    </>
  );
};

export default SaveQuit;
