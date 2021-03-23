import React, { useContext, useEffect, useState } from 'react';
import StoryOutput from './StoryOuput';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import { getPageLabel } from '../../../../getPageLabel';
import Banner from '../../../../Lesson/LessonComponents/Banner';
import ReflectionQuestions from '../../../../Lesson/LessonComponents/ReflectionQuestions';
import Modules from '../../../../Lesson/LessonComponents/StoryPage/StoryBreakdown/Modules';

interface props {
  fullscreen: boolean;
}

const SelfDisplay = (props: props) => {
  const { fullscreen } = props;
  const { state, theme, dispatch } = useContext(LessonControlContext);
  const [dataProps, setDataProps] = useState<{ title?: string; story?: string[]; [key: string]: any } | null>(null);
  const title = state.data.lesson.warmUp.title;
  const showTitle = state.data.lesson?.warmUp?.inputs?.title;
  const questArr = state.data.lesson?.warmUp?.breakdown?.reflectionQuestions;

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown' });
  }, []);

  let displayStudentData = state.studentViewing.live
    ? state.studentViewing.studentInfo.currentLocation
      ? getPageLabel(state.studentViewing.studentInfo.currentLocation, state.pages) === 'warmup/breakdown'
      : state.studentViewing.studentInfo.lessonProgress === 'warmup/breakdown'
    : false;

  useEffect(() => {
    if (displayStudentData) {
      if (state.studentViewing.studentInfo.warmupData) {
        return setDataProps(state.studentViewing.studentInfo.warmupData);
      }
    }
    return setDataProps(null);
  }, [state.studentViewing]);


  return (
    <div className={theme.section}>
      <ReflectionQuestions isTeacher={true} questions={questArr}/>
      {
        showTitle && (
          <Banner isTeacher={true} title={dataProps && dataProps.title ? dataProps.title : title}
                  iconName={`FaScroll`} />
        )
      }
      <StoryOutput story={dataProps && dataProps.story ? dataProps.story : ['']} />
      <Modules isTeacher={true} additional={dataProps?.additional} />
    </div>
  );
};

export default SelfDisplay;
