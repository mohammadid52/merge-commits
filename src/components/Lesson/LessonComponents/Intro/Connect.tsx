import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import useDictionary from '../../../../customHooks/dictionary';

const Connect = () => {
  const {state, theme, userLanguage, clientKey } = useContext(LessonContext);
  const connection = state.data.lesson.connection;
  // const { lessonDict } = useDictionary(clientKey);

  return (
    <div className={`flex flex-col md:w-full md:h-full text-sm rounded-r-lg`}>
      <div className={`md:w-full md:h-full flex flex-col text-lx rounded-r-lg`}>
        <h1 className={`w-full text-xl ${theme.banner} ${theme.underline}`}>SEL Connection:</h1>
        <p className={`${theme.elem.text}`}>{connection}</p>
      </div>
    </div>
  );
};

export default Connect;
