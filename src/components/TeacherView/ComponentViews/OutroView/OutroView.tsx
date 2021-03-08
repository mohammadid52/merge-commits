import React, { useContext } from 'react';
import MoreArtist from './MoreArtist';
import Feedback from './Feedback';
import SaveQuit from './SaveQuit';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

import Banner from '../../../Lesson/LessonComponents/Banner';

interface props {
  fullscreen: boolean;
}

const OutroView = (props: props) => {
  const { fullscreen } = props;
  const { state, theme } = useContext(LessonControlContext);

  const { title } = state.data.lesson;

  return (
    <div className={theme.section}>
      {state.data.lesson.type !== 'survey' ? <Banner isTeacher={true} title={`You've completed ${title}!`} /> : null}
      <div className={theme.section}>
        <div className='flex flex-col justify-between items-center'>
          <Feedback fullscreen={fullscreen} />
          <MoreArtist fullscreen={fullscreen} />
          <SaveQuit fullscreen={fullscreen} />
        </div>
      </div>
    </div>
  );
};

export default OutroView;
