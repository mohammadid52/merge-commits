import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import Banner from './Banner';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaPenFancy, FaCheckSquare } from 'react-icons/fa';
import PhotoBlock from './PhotoBlock';
import QuoteBlock from './QuoteBlock';
import VideoBlock from './VideoBlock';
import TrophyBlock from './TrophyBlock';
import MoreArtist from './MoreArtist';
import Feedback from './Feedback';
import Links from './Links';
import SaveQuit from './SaveQuit';
import OutroText from './OutroText';

const Outro = () => {
  const { state, dispatch, theme } = useContext(LessonContext);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'outro' });
    dispatch({ type: 'FINISH' });
  }, []);

//   if ( state.data.lesson.type !== 'lesson' ) {
//     return (
//         <div className={`z-50 w-full h-full flex flex-col justify-between items-center`}>
//             <div className={`w-full h-1/10  text-xl md:text-5xl ${theme.banner}`}>
//                 <IconContext.Provider value={{ color: '#EDF2F7', size: '2.75rem'}}>
//                     <div className={`red bg-dark-red h-16 w-16 flex flex-col items-center justify-center z-20 rounded-lg shadow-2 ${theme.block.shadow}`}>
//                         <FaCheckSquare />
//                     </div>
//                 </IconContext.Provider>
//                 <div className={`h-full w-full flex flex-row justify-center items-center text-5xl text-center font-open font-medium ${theme.block.text} z-10`}>
//                     Title
//                 </div>
//             </div>

//             <div className={`w-5/10 h-8.8/10 flex justify-center items-center`}>
//               <div className="h-6/10 w-full flex flex-col justify-around items-center">
//                 <Feedback/>
//                 <SaveQuit/>
//               </div>
//             </div>
            
//         </div>
//     )
// }

  return (
    <div className='w-full md:h-full flex flex-col justify-between items-center'>
      { state.data.lesson.type !== 'survey' ?
        <Banner />
        : null
      }
      {/* <div className='w-full md:h-8.8/10 flex flex-col md:flex-row justify-between items-center'> */}
      <div className='w-full md:h-full flex flex-col justify-around items-center'>
          {
            state.data.lesson.type !== 'survey' ?
            <div className="w-5/10 h-8/10 flex flex-col justify-between items-center">
              <Feedback/>
              <MoreArtist/>
              <SaveQuit id={state.data.lesson.id}/>
            </div>
            :
            <div className="w-7/10 h-8/10 flex flex-col justify-between items-center">
              <OutroText />
              <SaveQuit id={state.data.lesson.id}/>
            </div>
          }
          
        {/* ///
        <div className="w-5/10 h-full mt-4 md:mt-0 md:ml-2">
                    <MoreArtist />
                </div>

                <div className="w-4.8/10 h-full flex flex-col justify-between">
                    <div className="flex justify-between h-5/10">
                        <TrophyBlock />
                        <Links />
                    </div>
                    <Feedback />
                </div>
             ///   
        <div className='w-4.5/10 h-full my-4 md:ml-2 flex flex-col justify-center'>
          <VideoBlock link='https://www.youtube.com/embed/bp10ZOtv_zY' fullscreen={fullscreen}/>
          
        </div>

        <div className='w-4.5/10 h-full flex flex-col justify-between my-4 md:ml-2'>
          <MoreArtist />
          <div className="flex h-2.5/10">
          <TrophyBlock />
          <Links />
          </div>
          <Feedback />
        </div> */}

      </div>
    </div>
  );
};

export default Outro;
