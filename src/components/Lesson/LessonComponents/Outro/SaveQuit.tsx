import React, { useContext } from 'react';
// import { IconContext } from 'react-icons';
// import { FaRegSave, FaHome } from 'react-icons/fa';
// import { AiOutlineSave, AiOutlineHome } from 'react-icons/ai';
import { NavLink, useHistory } from 'react-router-dom';
import { LessonContext } from '../../../../contexts/LessonContext';
import { API, graphqlOperation } from 'aws-amplify';
import * as customMutations from '../../../../customGraphql/customMutations';

const SaveQuit = () => {
  const { state, theme } = useContext(LessonContext);
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
            const questionData = await API.graphql(graphqlOperation(customMutations.createQuestionData, {input: questiondDataObject}))
            console.log(questionData, 'questionData');
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
