import React, { useContext } from 'react';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

import { LessonInfoTitleBarProps } from '../TopMenu';

const PlayComplete: React.FC<LessonInfoTitleBarProps> = (props: LessonInfoTitleBarProps) => {
  const { handleOpen, handleLessonButton } = props;
  const { state, theme, dispatch } = useContext(LessonControlContext);

  return (
    <>
      {/* START / COMPLETE BUTTON */}
      {!state.open || state.complete ? (
        <span
          className="w-auto h-6 my-auto mr-2 leading-4 text-xs text-white bg-sea-green hover:bg-green-500 hover:text-underline p-1 rounded-lg cursor-pointer"
          onClick={() => {
            !state.open || state.complete ? handleOpen() : null;
          }}>
          Start
        </span>
      ) : null}

      {!state.complete ? (
        <span
          className="w-auto h-6 my-auto  mr-2 leading-4 text-xs text-white bg-blueberry hover:bg-blue-500 hover:text-underline p-1 rounded-lg cursor-pointer"
          onClick={() => {
            !state.complete ? handleLessonButton() : null;
          }}>
          Complete
        </span>
      ) : null}
    </>
  );
};

export default PlayComplete;
