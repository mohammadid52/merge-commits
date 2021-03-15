import React, { useContext, useEffect, useState } from 'react';
// import { useCookies } from 'react-cookie';
import InstructionsBlock from './InstructionBlock';
import StoryForm from './StoryForm';
import Modules from './Modules';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import { getPageLabel } from '../../../../getPageLabel';
import Banner from '../../../../Lesson/LessonComponents/Banner';

export interface StoryState {
  story: string[];
  title?: string;
  additional?: {
    name: string;
    text: string | [];
  }[];
}

interface props {
  fullscreen: boolean;
}

const Story = (props: props) => {
  const { fullscreen } = props;
  const { state, theme } = useContext(LessonControlContext);
  const inputs = state.data.lesson.warmUp.inputs;
  const [dataProps, setDataProps] = useState<{ title?: string; story?: string[]; [key: string]: any }>();

  let displayStudentData = state.studentViewing.live
    ? state.studentViewing.studentInfo.currentLocation
      ? getPageLabel(state.studentViewing.studentInfo.currentLocation, state.pages) === 'warmup'
      : state.studentViewing.studentInfo.lessonProgress === 'warmup'
    : false;

  useEffect(() => {
    if (displayStudentData) {
      if (state.studentViewing.studentInfo.warmupData) {
        return setDataProps(state.studentViewing.studentInfo.warmupData);
      }
      return setDataProps(null);
    }
  }, [state.studentViewing]);

  const title = state.data.lesson.warmUp.title

  return (
    <>
      {/* <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup}/> */}
      <div className={theme.section}>

        <Banner isTeacher={true} title={title} iconName={`FaScroll`}/>

        <div className="flex flex-col justify-between items-center">
          <InstructionsBlock fullscreen={fullscreen} />

          <StoryForm dataProps={dataProps} fullscreen={fullscreen} />

          {inputs.additionalInputs.length > 0 ? (
            <Modules dataProps={dataProps} inputs={inputs.additionalInputs} fullscreen={fullscreen} />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Story;
