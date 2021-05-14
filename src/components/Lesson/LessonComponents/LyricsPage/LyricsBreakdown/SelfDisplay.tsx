import React, { useContext, useEffect, useState } from 'react';
import ReflectionQuestions from '../../ReflectionQuestions';
import LyricsOutput from './LyricsOutput';
import { LessonContext } from '../../../../../contexts/LessonContext';
import Banner from '../../Banner';

const SelfDisplay = () => {
  const { dispatch, theme, state } = useContext(LessonContext);
  const [modules, setModules] = useState<Array<any>>();
  const displayProps = state.componentState?.lyrics?.selected;
  const { artist, title } = state.data.lesson.coreLesson.content;
  const moduleTypes = state.data.lesson.coreLesson.tools;

  const arrayParseToString = (arr: Array<Array<{ [key: string]: any }>>) => {
    // console.log('selfdisplay arr: ', arr)
    let resultArray = arr.map((item: Array<{ text: string; [key: string]: any }>) => {
      let parsedString = '';
      item.forEach((item: { text: string; [key: string]: any }) => {
        // console.log('arrayParseToString: ', item);
        parsedString = parsedString + ' ' + item.text;
      });
      return parsedString;
    });
    return resultArray;
  };

  useEffect(() => {
    if (displayProps) {
      let modulesArray = moduleTypes.map((item: { [key: string]: any }) => {
        let contentArray = displayProps
          .filter((selection: { color: string; content: any }) => {
            return item.color === selection.color;
          })
          .map((selection: { content: any }) => {
            return selection.content;
          });

        return {
          name: item.name,
          label: item.icon,
          color: item.color,
          content: arrayParseToString(contentArray),
        };
      });

      setModules(modulesArray);
    }

    dispatch({ type: 'ACTIVATE_LESSON', payload: 'corelesson/breakdown' });
  }, []);

  // ${key === 0 ? 'md:mr-2' : key === modules.length - 1 ? 'md:ml-2' : 'md:mx-2'}

  return (
    <div className={theme.section}>
      <ReflectionQuestions questions={state.data.lesson.coreLesson.breakdown.reflectionQuestions} />
      <Banner title={title} iconName={`FaHeadphonesAlt`} />
      <LyricsOutput modules={modules} />
    </div>
  );
};

export default SelfDisplay;
