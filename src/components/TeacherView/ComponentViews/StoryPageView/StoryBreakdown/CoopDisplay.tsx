// import React, { useState, useEffect, useContext } from 'react';
// import { LessonContext } from '../../../../../contexts/LessonContext';
// import ReflectionQuestions from './ReflectionQuestions';
// import Modules from './Modules';
// import Banner from './Banner';
// import { IconContext } from "react-icons";
// import { FaExpand, FaCompress } from 'react-icons/fa';


// const CoopDisplay = () => {
//     const { state, dispatch } = useContext(LessonContext);
//     const displayProps = state.componentState.story;
//     const [fullscreen, setFullscreen] = useState(false);

//     const handleFullscreen = () => {
//         setFullscreen(fullscreen => {
//             return !fullscreen
//         });
//     }

//     useEffect(() => {
//         dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown'})
//     }, [])


//         return (
//             <div className="w-full h-full flex flex-col justify-between items-center">
//                 <div className="w-full h-8.3/10 flex justify-between items-center">

//                     {/* self display */}
//                     <div className={`${fullscreen ? 'hidden' : 'w-4.85/10'} h-full flex flex-col justify-between items-center`}>
//                         <Banner title={displayProps.title}
//                             display='COOP' />

//                         <div className="w-full h-8.8/10 flex flex-col md:flex-row justify-between">
//                             <div className={`bg-dark-blue ${displayProps.additional ? 'md:w-7.9/10' : 'w-full'} md:mb-0 overflow-scroll h-full p-4 md:p-6 items-center text-md md:text-xl text-gray-200 rounded-lg shadow-2`}>
//                                 <div className="bg-lighter-blue shadow-inner-box p-4 h-full rounded-lg">
//                                     { displayProps.story }
//                                 </div>
//                             </div>
//                             <Modules 
//                                 additional={displayProps.additional} 
//                                 displayMode = "SELFhalf" />
//                         </div>
//                     </div>

//                     {/* teacher display */}
//                     <div className={`relative ${fullscreen ? 'w-full' : 'w-4.85/10'} h-full rounded-lg border shadow-inner-dark bg-darker-blue p-4`}>
//                         <div className="w-full h-full flex flex-col justify-between items-center">
//                             <div className="absolute cursor-pointer w-auto text-xl m-2" style={{bottom: 0, right: 0}} onClick={handleFullscreen}>
//                                 <IconContext.Provider value={{ color: '#E2E8F0', size: '2rem' }}>
//                                     {fullscreen ? < FaCompress /> :< FaExpand />}
//                                 </IconContext.Provider>
//                             </div>
//                             <Banner title={displayProps.title} 
//                                 display='COOP'/>

//                             <div className="w-full h-8.8/10 flex md:flex-col justify-between">
//                                 <div className={`bg-dark-blue ${displayProps.additional ? 'md:h-7.85/10' : 'h-full'} ${fullscreen ? 'text-lg md:text-2xl' : 'text-md md:text-xl'} md:mb-0 overflow-scroll w-full p-4 md:p-6 items-center text-gray-200 rounded-lg shadow-2`}>
//                                     <div className="bg-lighter-blue shadow-inner-box p-4 h-full rounded-lg">
//                                         { displayProps.story }
//                                     </div>
//                                 </div>
//                                 <Modules 
//                                     additional={displayProps.additional}
//                                     displayMode = "COOP" />
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//                 <ReflectionQuestions />
//             </div>
//         )
//     }


// export default CoopDisplay;