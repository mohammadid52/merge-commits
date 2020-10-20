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
  const [ fullscreen, setFullscreen ] = useState(false);
  const [ feedback, setFeedback ] = useState({
    like: '',
    text: '',
  });

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'outro' });
    dispatch({ type: 'FINISH' });
  }, []);

  return (
    <div className={theme.section}>
      { state.data.lesson.type !== 'survey' ?
        <Banner />
        : null
      }
      <div className={theme.section}>
          {
            state.data.lesson.type !== 'survey' ?
            <div className="flex flex-col justify-between items-center">
              <Feedback setFeedback={setFeedback} />
              <MoreArtist/>
              <SaveQuit id={state.data.lesson.id} feedback={feedback}/>
            </div>
            :
            <div className="flex flex-col justify-between items-center">
              <OutroText />
              <SaveQuit id={state.data.lesson.id}/>
            </div>
          }

      </div>
    </div>
  );
};

export default Outro;
