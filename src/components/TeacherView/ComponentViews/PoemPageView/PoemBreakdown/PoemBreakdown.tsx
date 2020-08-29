// import React, { useState, useEffect, useContext } from 'react';
// import { LessonContext } from '../../../../../contexts/LessonContext';
// import Banner from './Banner';
// import ReflectionQuestions from './ReflectionQuestions';
// import SelfDisplay from './SelfDisplay';
// import CoopDisplay from './CoopDisplay';



// const Breakdown = () => {
//     const { state, dispatch } = useContext(LessonContext);
//     const displayProps = state.componentState.poem;

//     const [displayMode, setDisplayMode] = useState('COOP');

//     useEffect(() => {
//         dispatch({type: 'ACTIVATE_LESSON', payload: 'activity/breakdown'})
//     }, [])


//     if (displayMode === 'SELF') {
//         return (
//             <SelfDisplay />
//         )} if (displayMode === 'COOP') {
//             return (
//                 <CoopDisplay />
//             )
//         }
//     }

// export default Breakdown;