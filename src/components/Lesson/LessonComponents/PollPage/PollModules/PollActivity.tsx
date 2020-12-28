import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import InstructionsBlock from './InstructionBlock';
import Banner from './Banner';
import Modules from './Modules';
import InstructionsPopup from '../../../Popup/InstructionsPopup';
import PollForm from './PollForm';

export interface PollInput {
  id: string;
  question?: string;
  option: {
    id: string;
    option?: string;
    isChoice: boolean;
  };
}

export type PollInputState = Array<PollInput>;

const Poll = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const [cookies, setCookie] = useCookies([`lesson-${state.classroomID}`]);
  const inputs = state.data.lesson.warmUp.inputs;
  const video = state.data.lesson.warmUp.instructions.link;
  const [openPopup, setOpenPopup] = useState(false);

  // useEffect(() => {
  //   if (cookies[`lesson-${state.classroomID}`].poll) {
  //     dispatch({
  //       type: 'SET_INITIAL_COMPONENT_STATE',
  //       payload: {
  //         name: 'poll',
  //         content: cookies[`lesson-${state.classroomID}`].poll,
  //       },
  //     });
  //   } else {
  //     let inputsArray = inputs.pollInputs.map((item: { id: string; question: string; option: any }) => {
  //       return {
  //         id: item.id,
  //         question: item.question,
  //         option: { id: item.option.id, isChoice: item.option.isChoice },
  //       };
  //     });
  //
  //     let initialObject = {
  //       pollInputs: inputsArray,
  //     };
  //
  //     dispatch({
  //       type: 'SET_INITIAL_COMPONENT_STATE',
  //       payload: {
  //         name: 'poll',
  //         content: initialObject,
  //       },
  //     });
  //
  //     setCookie(`lesson-${state.classroomID}`, { ...cookies[`lesson-${state.classroomID}`], poll: initialObject });
  //   }
  // }, []);

  return (
    <>
      {state.componentState.poll && state.componentState.poll.pollInputs ? (
        <>
          <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup} />
          <div className={theme.section}>
            <Banner />

            <div className="flex flex-col justify-between items-center">
              <InstructionsBlock />
              {/*{inputs.additionalInputs.length > 0 ? <Modules inputs={inputs.additionalInputs} /> : null}*/}

              <PollForm />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Poll;
