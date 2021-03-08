import React, { useContext, useEffect, useState } from 'react';
import ReflectionQuestions from './ReflectionQuestions';
import LyricsOutput from './LyricsOutput';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import { getPageLabel } from '../../../../getPageLabel';
import Banner from '../../../../Lesson/LessonComponents/Banner';

interface props {
  fullscreen: boolean;
}

const SelfDisplay = (props: props) => {
  const { fullscreen } = props;
  const { dispatch, state, theme } = useContext(LessonControlContext);
  const [modules, setModules] = useState<Array<any>>();
  const dataProps =
    state.studentViewing.studentInfo &&
    state.studentViewing.studentInfo.corelessonData &&
    state.studentViewing.studentInfo.corelessonData.selected
      ? state.studentViewing.studentInfo.corelessonData.selected
      : [];
  const moduleTypes = state.data.lesson.coreLesson.tools;
  
  let displayStudentData = state.studentViewing.live ? state.studentViewing.studentInfo.currentLocation ? getPageLabel(state.studentViewing.studentInfo.currentLocation, state.pages) === 'corelesson/breakdown' : state.studentViewing.studentInfo.lessonProgress === 'corelesson/breakdown' : false;

  const arrayParseToString = (arr: Array<Array<{ [key: string]: any }>>) => {
    let resultArray = arr.map((item: Array<{ text: string; [key: string]: any }>) => {
      let parsedString = '';
      item.forEach((item: { text: string; [key: string]: any }) => {
        parsedString = parsedString + ' ' + item.text;
      });
      return parsedString;
    });
    return resultArray;
  };

  useEffect(() => {
    if (displayStudentData && dataProps) {
      let modulesArray = moduleTypes.map((item: { [key: string]: any }) => {
        let contentArray = dataProps
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

      return setModules(modulesArray);
    }

    let modulesArray: any = moduleTypes.map((item: { [key: string]: any }) => {
      let obj: any = {
        name: item.name,
        label: item.icon,
        color: item.color,
        content: [],
      };
      return obj;
    });

    return setModules(modulesArray);
  }, [state.studentViewing]);

  useEffect(() => {
    console.log('LyricsBreakdownView: ', modules);
  }, []);

  const { title } = state.data.lesson.coreLesson.content;

  return (
    <div className={theme.section}>
      <ReflectionQuestions fullscreen={fullscreen} />
      <Banner isTeacher={true} title={title} iconName={`FaHeadphonesAlt`} />
      <LyricsOutput modules={(modules) ? modules : []} />
    </div>
  );
};

export default SelfDisplay;
