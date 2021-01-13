import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import InstructionsBlock from './InstructionBlock';
import Banner from '../../Banner';
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
  const title = state.data.lesson.warmUp.title;

  return (
    <>
      {inputs ? (
        <>
          <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup} />
          <div className={theme.section}>
            <Banner title={title} iconName={'FaPoll'} />

            <div className="flex flex-col justify-between items-center">
              <InstructionsBlock />
              {inputs.additionalInputs.length > 0 ? <Modules inputs={inputs.additionalInputs} /> : null}

              <PollForm />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Poll;
