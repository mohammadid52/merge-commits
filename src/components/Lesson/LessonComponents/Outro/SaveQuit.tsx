import React, { useContext } from 'react';
// import { IconContext } from 'react-icons';
// import { FaRegSave, FaHome } from 'react-icons/fa';
// import { AiOutlineSave, AiOutlineHome } from 'react-icons/ai';
import { NavLink, useHistory } from 'react-router-dom';
import { LessonContext } from '../../../../contexts/LessonContext';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../../../../customGraphql/customMutations';
import { GlobalContext } from '../../../../contexts/GlobalContext';

interface SaveQuitProps {
  id: string
}

const SaveQuit = (props: SaveQuitProps) => {
  const { state, dispatch, theme } = useContext(LessonContext);
  const { globalStateAccess } = useContext(GlobalContext);
  const { id } = props;
  const history = useHistory();
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
        classroomID: 1,
        studentID: state.studentUsername,
        studentAuthID: state.studentAuthID,
        warmupData: state.componentState.story ? state.componentState.story : null,
        corelessonData: state.componentState.lyrics ? state.componentState.lyrics : null,
        activityData: state.componentState.poem ? state.componentState.poem : null
    }

    console.log('update', data);
    
    try {
        // const dataObject: any = await API.graphql(graphqlOperation(customMutations.updateStudentData, { input: data }))
        // console.log(dataObject)
        // dispatch({ type: 'SAVED_CHANGES' })
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

    console.log(updatedStudent, 'updatedSurvey');
    
    try {
      const updatedStudentData: any = await API.graphql(graphqlOperation(customMutations.updateSurveyStatus, { input: updatedStudent }))
      console.log(updatedStudentData);
      
    } catch ( err ) {
      console.error(err);
    
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

        await updateStudentProfile()

        await updateStudentData()

        history.push('/dashboard')
    }
  } 
    
    const saveQuestionData = async (key: string, questionID: string) => {
        let questiondDataObject = {
            questionID: key,
            classroomID: "1",
            authID: state.studentAuthID,
            email: state.studentUsername,
            response: state.questionData[key][questionID]
        }
        try { 
            // const questionData = await API.graphql(graphqlOperation(customMutations.createQuestionData, {input: questiondDataObject}))
            // console.log(questionData, 'questionData');
        } catch (err) {
            console.error(err);
            
        }
    }   

  return (
    <span className="w-7/10 ml-3 flex inline-flex rounded-md shadow-sm">
        <button type="submit" className="text-xs sm:text-base inline-flex justify-center py-1 md:py-2 px-2 md:px-4 border border-transparent text-m leading-5 font-medium rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:border-yellow-700 focus:shadow-outline-yellow active:bg-yellow-700 transition duration-150 ease-in-out" onClick={handleSave}>
        Save and Go to Dashboard
        </button>
    </span>
  );
};

export default SaveQuit;
