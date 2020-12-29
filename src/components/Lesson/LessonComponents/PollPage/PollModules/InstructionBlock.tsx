import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface InstructionBlockProps {
  isTeacher?: boolean;
}

const InstructionsBlock = (props: InstructionBlockProps) => {
  /**
   * Teacher switch
   */
  const {isTeacher} = props;

  const switchContext = (isTeacher) ? useContext(LessonControlContext) : useContext(LessonContext);

  const { state, theme } = switchContext;

  const [videoMode, setVideoMode] = useState(false);
  const { text, video, link } = state.data.lesson.warmUp.instructions;

  const toggleVideoMode = () => {
    setVideoMode(!videoMode);
  };

  return (
    <>
      <div className={`w-full h-full rounded-xl`}>
        <h3 className={`w-full text-xl ${theme.banner} ${theme.underline}`}>Instructions</h3>

        <div className={theme.elem.text}>
          {text.map((inst: string, key: number) => (
            <p key={key} className="mb-1">
              {inst}
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default InstructionsBlock;
