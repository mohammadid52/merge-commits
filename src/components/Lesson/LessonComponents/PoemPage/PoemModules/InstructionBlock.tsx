import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaVideo } from 'react-icons/fa';
import ToolTip from '../../../../General/ToolTip/ToolTip';

interface InstructionsBlockProps {
  editMode: boolean;
}

const InstructionsBlock = (props: InstructionsBlockProps) => {
  const { editMode } = props;
  const { state, theme } = useContext(LessonContext);
  const [videoMode, setVideoMode] = useState(false);
  const instructions = state.data.lesson.activity.instructions;

  const toggleVideoMode = () => {
    setVideoMode(!videoMode);
  };

  if (editMode) {
    return (
      <>
        <div className={`w-full h-full rounded-xl`}>
          <h3 className={`w-full h-1/10 text-xl ${theme.banner} ${theme.underline}`}>
            Instructions
          </h3>
        </div>
        <div className={theme.elem.text}>
          Make the final edits to your poem, and get ready to present.
        </div>
      </>
    );
  }

  return (
    <>
      <div className={`w-full h-full rounded-xl`}>
        <h3 className={`w-full h-1/10 text-xl ${theme.banner} ${theme.underline}`}>Instructions</h3>
      </div>
        {/* {!videoMode ? ( */}
        <div className={theme.elem.text}>
          {instructions.text.map((inst: string, key: number) => (
            <p key={key} className='mb-2'>
              {inst}
            </p>
          ))}
        </div>
    </>
  );
};

export default InstructionsBlock;
