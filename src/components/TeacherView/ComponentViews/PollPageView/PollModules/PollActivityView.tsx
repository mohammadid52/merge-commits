import React, { useContext, useEffect, useState } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

/**
 * IMPORT STUDENT COMPONENTS
 */
import Banner from '../../../../Lesson/LessonComponents/PollPage/PollModules/Banner';
import InstructionBlock from '../../../../Lesson/LessonComponents/PollPage/PollModules/InstructionBlock';
import PollForm from '../../../../Lesson/LessonComponents/PollPage/PollModules/PollForm';

/**
 * IMPORT INTERFACES
 */
import { PollInput } from '../../../../Lesson/LessonComponents/PollPage/PollModules/PollActivity';
import Modules from '../../../../Lesson/LessonComponents/PollPage/PollModules/Modules';

interface DataProps {
  pollInputs: PollInput[];
  additional: any;
}

const PollActivityView = () => {
  const { state, theme } = useContext(LessonControlContext);
  const inputs = state.data.lesson.warmUp.inputs;
  const [dataProps, setDataProps] = useState<DataProps>();

  /**
   * INITIALIZE VIEWING STUDENT DATA
   */
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
    } else {
      return setDataProps(null);
    }
  }, [state.studentViewing]);

  return (
    <>
      {/**
       *
       * 0. Banner
       *
       */}
      <div className={theme.section}>
        <Banner isTeacher={true} />

        <div className="flex flex-col justify-between items-center">
          {/**
           *
           * 1. Instructions
           * 2. Modules
           * 3. Poll form
           *
           */}
          <InstructionBlock isTeacher={true} />
          {inputs.additionalInputs.length > 0 ? (
            <Modules isTeacher={true} inputs={inputs.additionalInputs} dataProps={dataProps} />
          ) : null}

          <PollForm isTeacher={true} dataProps={dataProps} />
        </div>
      </div>
    </>
  );
};

export default PollActivityView;
