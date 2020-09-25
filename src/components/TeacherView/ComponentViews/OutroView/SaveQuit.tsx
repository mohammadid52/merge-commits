import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { LessonContext } from '../../../../contexts/LessonContext';
import { API, graphqlOperation } from 'aws-amplify';
import * as customMutations from '../../../../customGraphql/customMutations';

interface props {
        fullscreen: boolean
    }

const SaveQuit = (props: props) => {    
  const {  fullscreen } = props;
//   const { state, dispatch, theme } = useContext(LessonContext);
//   const history = useHistory();

//   const updateStudentData = async () => {
//     let lessonProgress = state.pages[state.lessonProgress].stage === '' ? 'intro' : state.pages[state.lessonProgress].stage;


//     let data = {
//         id: state.studentDataID,
//         lessonProgress: lessonProgress,
//         status: state.studentStatus,
//         classroomID: 1,
//         studentID: state.studentUsername,
//         studentAuthID: state.studentAuthID,
//         warmupData: state.componentState.story ? state.componentState.story : null,
//         corelessonData: state.componentState.lyrics ? state.componentState.lyrics : null,
//         activityData: state.componentState.poem ? state.componentState.poem : null
//     }

//     console.log('update', data);
    
//     try {
//         const dataObject: any = await API.graphql(graphqlOperation(customMutations.updateStudentData, { input: data }))
//         console.log(dataObject)
//         dispatch({ type: 'SAVED_CHANGES' })
//     } catch (error) {
//         console.error(error);   
//     }
//   }


//   const handleSave = async () => {       
//     if (typeof state.questionData === "object") {
//         let keys = Object.keys(state.questionData)
//         await keys.forEach(async (key: string) => {
//             let questionIDs = Object.keys(state.questionData[key])
//             questionIDs.forEach(async (questionID: string) => {
//               await saveQuestionData(key, questionID)
//           })
//         })

//         await updateStudentData()

//         history.push('/dashboard')
//     }
//   } 
    
//     const saveQuestionData = async (key: string, questionID: string) => {
//         let questiondDataObject = {
//             questionID: key,
//             classroomID: "1",
//             authID: state.studentAuthID,
//             email: state.studentUsername,
//             response: state.questionData[key][questionID]
//         }
//         try { 
//             const questionData = await API.graphql(graphqlOperation(customMutations.createQuestionData, {input: questiondDataObject}))
//             console.log(questionData, 'questionData');
//         } catch (err) {
//             console.error(err);
            
//         }
//     }   

  return (
    <span className="w-7/10 ml-3 flex inline-flex rounded-md shadow-sm">
        <button type="submit" className="text-xs sm:text-base inline-flex justify-center py-1 md:py-2 px-2 md:px-4 border border-transparent text-m leading-5 font-medium rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:border-yellow-700 focus:shadow-outline-yellow active:bg-yellow-700 transition duration-150 ease-in-out" >
        Save and Go to Dashboard
        </button>
    </span>
  );
};

export default SaveQuit;
