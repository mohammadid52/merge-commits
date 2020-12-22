import React, { useState, useContext, useEffect } from 'react';
// import { useCookies } from 'react-cookie';
import InstructionsBlock from './InstructionBlock';
import ListForm from './ListForm';
import Banner from './Banner';
import Modules from './Modules';
import { studentObject } from '../../../../../state/LessonControlState';
import InstructionsPopup from '../../../../Lesson/Popup/InstructionsPopup';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import { string } from 'prop-types';

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

const List = (props: props) => {
  const { fullscreen } = props;
  const { state, theme } = useContext(LessonControlContext);
  const [openPopup, setOpenPopup] = useState(false);
  const [dataProps, setDataProps] = useState<{ title?: string; story?: string[]; [key: string]: any }>();

  //  Variables
  const inputs = state.data.lesson.warmUp.inputs;
  const video = state.data.lesson.warmUp.instructions.link;
  const nrLists = inputs.listInputNumber;
  // const listArray = nrLists === null ? [''] : Array.from(Array(nrLists).keys()).map((elem: number) => '');

  let displayStudentData = state.studentViewing.live
    ? state.studentViewing.studentInfo.currentLocation
      ? state.studentViewing.studentInfo.currentLocation === 'warmup'
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
      <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup} />
      <div className={theme.section}>
        <Banner fullscreen={fullscreen} />

        <div className="flex flex-col justify-between items-center">
          <InstructionsBlock fullscreen={fullscreen} />

          {/* {inputs.additionalInputs.length > 0 ?
                        <Modules
                            dataProps={dataProps}
                            inputs={inputs.additionalInputs}
                            fullscreen={fullscreen}
                        />
                        :
                        null
                    } */}

          <ListForm dataProps={dataProps} fullscreen={fullscreen} nrLists={nrLists} />
        </div>
      </div>
    </>
  );
};

export default List;
