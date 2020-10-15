import React, { useState, useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaVideo } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ToolTip from '../../../../General/ToolTip/ToolTip';

const InstructionsBlock = () => {
  const { state, theme } = useContext(LessonContext);
  const [videoMode, setVideoMode] = useState(false);
  const { text, video, link } = state.data.lesson.coreLesson.instructions;
  const instructionsArr = state.data.lesson.coreLesson.instructions.text;

  const toggleVideoMode = () => {
    setVideoMode(!videoMode);
  };

  return (
    <div className={`w-full h-auto rounded-xl`}>
      <h3 className={`w-full h-1/10 text-xl ${theme.banner} ${theme.underline}`}>Instructions</h3>

      <div className={theme.elem.text}>
        {instructionsArr.map((inst: any, key: number) => (
          <p key={key} className='mb-2'>
            {inst}
          </p>
        ))}
      </div>
    </div>
  );
};

export default InstructionsBlock;
