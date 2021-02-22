import React, { useState, useContext, useEffect } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import { useCookies } from 'react-cookie';
import InstructionsBlock from './InstructionBlock';
import Banner from './Banner';
import Modules from './Modules';
import InstructionsPopup from '../../../../Lesson/Popup/InstructionsPopup';
import TruthGameForm from './TruthGameFormView';
import { getPageLabel } from '../../../../getPageLabel';

export interface TruthInput {
  id: string;
  label: string;
  isLie: boolean;
  text: string;
}

export type TruthInputState = Array<TruthInput>;

export interface TruthGameState {
  truthGameArray: Array<TruthInput>;
  [key: string]: any;
}

interface props {
  fullscreen: boolean;
}

const TruthGame = (props: props) => {
  const { fullscreen } = props;
  const { state, theme, dispatch } = useContext(LessonControlContext);
  // const [ cookies, setCookie ] = useCookies([`lesson-${state.syllabusLessonID}`]);
  const inputs = state.data.lesson.warmUp.inputs;
  const video = state.data.lesson.warmUp.instructions.link;
  const [openPopup, setOpenPopup] = useState(false);
  const [dataProps, setDataProps] = useState<{ truthGameArray: Array<TruthInput>; [key: string]: any }>();

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

  return (
    <>
      <div className={theme.section}>
        <Banner fullscreen={fullscreen} />

        <div className="flex flex-col justify-between items-center">
          {/*<InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup}/>*/}

          <InstructionsBlock fullscreen={fullscreen} />
          {/*{inputs.additionalInputs.length > 0 ? (*/}
          {/*  <Modules dataProps={dataProps} inputs={inputs.additionalInputs} fullscreen={fullscreen} />*/}
          {/*) : null}*/}

          <TruthGameForm dataProps={dataProps} fullscreen={fullscreen} />
        </div>
      </div>
    </>
  );
};

export default TruthGame;
