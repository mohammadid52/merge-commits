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
import {useOutsideAlerter} from '../../../General/hooks/outsideAlerter';

interface SaveQuitProps {
  id: string
  feedback?: {
    like: string;
    text: string;
  }
}

const SaveQuit = (props: SaveQuitProps) => {
  const { state, dispatch, theme } = useContext(LessonContext);
  const { globalStateAccess } = useContext(GlobalContext);
  const { id, feedback } = props;
  const history = useHistory();
  const {visible, setVisible, ref} = useOutsideAlerter(false);
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

    // console.log('thisone', state )

    let data = {
        id: state.studentDataID,
        lessonProgress: lessonProgress,
        status: state.studentStatus,
        classroomID: '1',
        studentID: state.studentUsername,
        studentAuthID: state.studentAuthID,
        warmupData: state.componentState.story ? state.componentState.story : null,
        corelessonData: state.componentState.lyrics ? state.componentState.lyrics : null,
        activityData: state.componentState.poem ? state.componentState.poem : null
    }

    // console.log('update', data);
    
    try {
        const dataObject: any = await API.graphql(graphqlOperation(customMutations.updateStudentData, { input: data }))
        // console.log(dataObject)
        dispatch({ type: 'SAVED_CHANGES' })
        // console.log('state', state)
    } catch (error) {
        console.error(error);   
    }

  }

  const updateStudentProfile = async () => {
    let updatedStudent = {
      id: globalStateAccess.user.id,
      authId: globalStateAccess.user.authId,
      email: globalStateAccess.user.email,
      onBoardSurvey: true,
    }

    // console.log(updatedStudent, 'updatedSurvey');
    
    try {
      const updatedStudentData: any = await API.graphql(graphqlOperation(customMutations.updateSurveyStatus, { input: updatedStudent }))
      // console.log(updatedStudentData);
      
    } catch ( err ) {
      console.error(err);
    
    }
  }
  
  const saveQuestionData = async (key: string, questionID: string) => {
    let questiondDataObject = {
      questionID: key,
      classroomID: '1',
      authID: state.studentAuthID,
      email: state.studentUsername,
      response: state.questionData[key][questionID]
    }

    try { 
      const questionData = await API.graphql(graphqlOperation(customMutations.createQuestionData, {input: questiondDataObject}))
      // console.log(questionData, 'questionData');

    } catch (err) {
      console.error(err);
      
    }
  }  
  
  const saveLessonFeedback = async () => {
    let feedbackInput = {
      classroomID: '1',
      liked: feedback.like,
      comment: feedback.text,
    }

    try {
      const feedbackData = await API.graphql(graphqlOperation( customMutations.createFeedback, { input: feedbackInput }))
      // console.log(feedbackData);

    } catch (error) {
      console.error(error);
    
    }
    
  }
  
  const handleSave = async () => {       
    if (typeof state.questionData === "object") {
        let keys = Object.keys(state.questionData)
        // console.log(Object.keys(state.questionData))
        await keys.forEach(async (key: string) => {
            let questionIDs = Object.keys(state.questionData[key])
            questionIDs.forEach(async (questionID: string) => {
              await saveQuestionData(key, questionID)
          })
        })

        if ( typeof feedback !== 'undefined' ) {
          if ( feedback?.like !== '' || feedback?.text !== '' ) {
            await saveLessonFeedback()
          }
        }

        if ( id === 'on-boarding-survey-1' ) { await updateStudentProfile() }

        await updateStudentData()

        history.push('/dashboard')
    }

    handleClick
    
  }
  
  const handleClick = () => {
    setVisible((prevState: any) => !prevState)
}

  


  return (
    <span className="relative w-7/10 ml-3 flex inline-flex rounded-md shadow-sm">
        <div className={`${visible ? 'absolute z-100' : 'hidden'} flex justify-center`} style={{top: '-450px'}} onClick={handleClick}>
            <Popup 
                alert={visible}
                setAlert={setVisible}
                header='You have completed a lesson!' 
                // content="Once you go to 'Final Edits' you will not be able to come back to these line prompts, but you will be able to see the line prompts on the side of the page" 
                button1='Save your lesson'
                svg='smile'
                handleButton1={handleSave}
                />
        </div>

        <button type="submit" className="text-xs sm:text-base inline-flex justify-center py-1 md:py-2 px-2 md:px-4 border border-transparent text-m leading-5 font-medium rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:border-yellow-700 focus:shadow-outline-yellow active:bg-yellow-700 transition duration-150 ease-in-out" onClick={handleClick}>
        Save and Go to Dashboard
        </button>
    </span>
  );
};

export default SaveQuit;
