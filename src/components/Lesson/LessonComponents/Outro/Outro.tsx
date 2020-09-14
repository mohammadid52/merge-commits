import React, { useContext, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import Banner from './Banner';
import PhotoBlock from './PhotoBlock';
import QuoteBlock from './QuoteBlock';
import TrophyBlock from './TrophyBlock';
import MoreArtist from './MoreArtist';
import Feedback from './Feedback';
import Links from './Links';

const Outro = () => {
  const { dispatch } = useContext(LessonContext);

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'outro' });
    dispatch({ type: 'FINISH' });
  }, []);

  return (
    <div className='w-full md:h-full flex flex-col justify-between items-center'>
      <Banner />

      {/* <div className='w-full md:h-8.8/10 flex flex-col md:flex-row justify-between items-center'> */}
      <div className='w-6/10 md:h-8.8/10 flex-col justify-center items-center overflow-auto'>
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

        <TrophyBlock />
        <MoreArtist />

        <Feedback />
      </div>
    </div>
  );
};

export default Outro;
