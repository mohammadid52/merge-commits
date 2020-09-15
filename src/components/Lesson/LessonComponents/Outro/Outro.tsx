import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import Banner from './Banner';
import PhotoBlock from './PhotoBlock';
import QuoteBlock from './QuoteBlock';
import VideoBlock from './VideoBlock';
import TrophyBlock from './TrophyBlock';
import MoreArtist from './MoreArtist';
import Feedback from './Feedback';
import Links from './Links';

const Outro = () => {
  const { dispatch } = useContext(LessonContext);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'outro' });
    dispatch({ type: 'FINISH' });
  }, []);

  return (
    <div className='w-full md:h-full flex flex-col justify-between items-center'>
      <Banner />

      {/* <div className='w-full md:h-8.8/10 flex flex-col md:flex-row justify-between items-center'> */}
      <div className='w-full md:h-8.8/10 flex flex-row justify-center items-center overflow-auto'>
        {/* <div className="w-5/10 h-full mt-4 md:mt-0 md:ml-2">
                    <MoreArtist />
                </div>

                <div className="w-4.8/10 h-full flex flex-col justify-between">
                    <div className="flex justify-between h-5/10">
                        <TrophyBlock />
                        <Links />
                    </div>
                    <Feedback />
                </div> */}
        <div className='w-4.5/10 h-full my-4 md:ml-2'>
          <MoreArtist />
          <VideoBlock link='https://www.youtube.com/embed/bp10ZOtv_zY' fullscreen={fullscreen}/>
        </div>

        <div className='w-4.5/10 h-full my-4 md:ml-2'>
          <TrophyBlock />
          <Feedback />
          <Links />
        </div>

      </div>
    </div>
  );
};

export default Outro;
