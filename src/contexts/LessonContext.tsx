// import React, { useReducer, useEffect, useState} from 'react';
// import { lessonState } from '../state/LessonState'
// import { lessonReducer } from '../reducers/LessonReducer'

// export const LessonContext = React.createContext(null);

// interface LessonProps {
//     children: React.ReactNode;
// }

// interface dataObject {
//     [key: string]: any;
// }

// export const LessonContextProvider: React.FC = ({ children }: LessonProps) => {
//     const [ data, setData ] = useState();
//     const [ state, dispatch ] = useReducer(lessonReducer, lessonState);
//     // const isLoading = state.status !== 'loaded';

//     useEffect(() => {
//         async function fetchData(){
//             const response = await fetch('/api/data')
//             const dataObject = await response.json();
//             setData(dataObject)
//         }

//         fetchData();

//         return function cleanup() { dispatch({ type: 'CLEANUP' })};
//     }, []);

//     useEffect(() => {
//         if (data){
//             const wordBank = data.student.word_bank;
//             const lessonPlan = data.lesson.lesson_plan;
//             let pagesArray = [
//                 {
//                     type: 'intro',
//                     stage: '',
//                     open: true,
//                     active: true,
//                 },
//                 {
//                     type: 'outro',
//                     stage: 'outro',
//                     open: true,
//                     active: false,
//                 }
//             ];

//             lessonPlan.reverse().forEach((lesson: { breakdown: any; stage: string; type: string; }) => {
//                 if (lesson.breakdown) {
//                     let tempBreakdown = {
//                         type: 'breakdown',
//                         stage: lesson.stage + '/breakdown',
//                         open: true,
//                         active: false,
//                     }
//                     pagesArray.splice(1, 0, tempBreakdown)
//                 }
//                 let tempPrimaryLesson = {
//                     type: lesson.type,
//                     stage: lesson.stage,
//                     open: true,
//                     active: false,
//                 }
//                 pagesArray.splice(1, 0, tempPrimaryLesson)

//             });

//             dispatch({ type:'SET_INITIAL_STATE', payload: { pages: pagesArray, word_bank: wordBank, data: data }})

//         }
//     }, [data])

//     console.log('state', state)

//     return (
//         <LessonContext.Provider value={{state, dispatch}}>
//             { children }
//         </LessonContext.Provider>
//     )
// }