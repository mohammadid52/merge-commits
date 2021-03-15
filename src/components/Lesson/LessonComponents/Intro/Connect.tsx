import React, { useContext } from 'react';
import {LessonComponentsInterface} from '../../../../interfaces/LessonComponentsInterfaces';
import { LessonContext } from '../../../../contexts/LessonContext';
import {LessonControlContext} from '../../../../contexts/LessonControlContext';
import useDictionary from '../../../../customHooks/dictionary';

const Connect = (props: LessonComponentsInterface) => {
  const {isTeacher} = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext)
  const {state, theme, userLanguage, clientKey } = switchContext;

  const connection = state.data.lesson?.connection;
  const { lessonDict } = useDictionary(clientKey);

  return (
    <div className={`flex flex-col md:w-full md:h-full text-sm rounded-r-lg`}>
      <div className={`md:w-full md:h-full flex flex-col text-lx rounded-r-lg`}>
        <h1 className={`w-full text-xl ${theme.banner} ${theme.underline}`}>{lessonDict[userLanguage].TOPIC_CONNECTION}:</h1>
        <p className={`${theme.elem.text}`}>{connection}</p>
      </div>
    </div>
  );
};

export default Connect;
