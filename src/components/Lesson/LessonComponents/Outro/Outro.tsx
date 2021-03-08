import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import MoreArtist from './MoreArtist';
import Feedback from './Feedback';
import SaveQuit from './SaveQuit';
import OutroText from './OutroText';
import Banner from '../Banner';

const Outro = () => {
  const { state, dispatch, theme } = useContext(LessonContext);
  const [fullscreen, setFullscreen] = useState(false);
  const [feedback, setFeedback] = useState({
    like: '',
    text: '',
  });

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'outro' });
    dispatch({ type: 'FINISH' });
  }, []);

  const {title} = state.data.lesson;

  return (
    <div className={theme.section}>
      {state.data.lesson.type !== 'survey' ? <Banner title={`You've completed ${title}!`} /> : null}
      <div className={theme.section}>
        {state.data.lesson.type !== 'survey' ? (
          <div className="flex flex-col justify-between items-center">
            <Feedback setFeedback={setFeedback} />
            <MoreArtist />
            <SaveQuit id={state.data.lesson.id} feedback={feedback} />
          </div>
        ) : (
          <div className="flex flex-col justify-between items-center">
            <OutroText />
            <SaveQuit id={state.data.lesson.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Outro;
