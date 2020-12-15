import React, { useState, useEffect, useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import ReflectionQuestions from './ReflectionQuestions';
import TruthGameOutput from './TruthGameOutput';
import Modules from './Modules';
import Banner from './Banner';

interface props {
  fullscreen: boolean;
}

const TruthGameBreakdown = (props: props) => {
  const { fullscreen } = props;
  const { state, dispatch, theme } = useContext(LessonControlContext);
  const [dataProps, setDataProps] = useState<{ truthGameArray: any; [key: string]: any } | null>(null);
  const inputs = state.data.lesson.warmUp.inputs;
  const { title } = state.data.lesson.warmUp.title;
  console.log(state.data.lesson.warmUp);

  // const displayProps = state.componentState.truthGame;
  // const [displayMode, setDisplayMode] = useState(state.data.lessonPlan[state.currentPage].displayMode);

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown' });
  }, []);

  let displayStudentData = state.studentViewing.live
    ? state.studentViewing.studentInfo.currentLocation
      ? state.studentViewing.studentInfo.currentLocation === 'warmup/breakdown'
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
      <ReflectionQuestions fullscreen={fullscreen} />
      <Banner title={title} fullscreen={fullscreen} />

      <TruthGameOutput truthGameData={dataProps && dataProps.truthGameArray ? dataProps.truthGameArray : ''} />
      {inputs.additionalInputs.length > 0 ? <Modules dataProps={dataProps} fullscreen={fullscreen} /> : null}
    </div>
  );
};

export default TruthGameBreakdown;
