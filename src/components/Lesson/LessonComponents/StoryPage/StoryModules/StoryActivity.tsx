import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import InstructionsBlock from './InstructionBlock';
import StoryForm from './StoryForm';
import Banner from './Banner';
import Modules from './Modules';
import InstructionsPopup from '../../../Popup/InstructionsPopup';

export interface StoryState {
  story: string[];
  title?: string;
  additional?: {
    name: string;
    text: string | [];
  }[];
}

const Story = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const [cookies, setCookie] = useCookies([`lesson-${state.syllabusLessonID}`]);
  const inputs = state.data.lesson.warmUp.inputs;
  // const video = state.data.lesson.warmUp.instructions.link
  // const [ openPopup, setOpenPopup ] = useState(false)

  useEffect(() => {
    if (!cookies[`lesson-${state.syllabusLessonID}`].story && !state.componentState.story) {
      let tempObj: StoryState = {
        story: [''],
      };
      if (inputs.title) {
        tempObj.title = '';
      }

      if (inputs.additionalInputs.length > 0) {
        let additional: Array<{ name: string; text: string | [] }> = [];
        inputs.additionalInputs.forEach((input: { name: string }) => {
          let newInput = {
            name: input.name,
            text: '',
          };

          additional.push(newInput);
        });

        tempObj.additional = additional;
      }

      dispatch({
        type: 'SET_INITIAL_COMPONENT_STATE',
        payload: {
          name: 'story',
          content: tempObj,
        },
      });

      setCookie(`lesson-${state.syllabusLessonID}`, { ...cookies[`lesson-${state.syllabusLessonID}`], story: tempObj });
    }

    if (cookies[`lesson-${state.syllabusLessonID}`].story) {
      dispatch({
        type: 'SET_INITIAL_COMPONENT_STATE',
        payload: {
          name: 'story',
          content: cookies[`lesson-${state.syllabusLessonID}`].story,
        },
      });
    }
  }, []);

  return (
    <>
      {/* <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup}/> */}
      <div className={theme.section}>
        <Banner />

        <div className="flex flex-col justify-between items-center">
          <InstructionsBlock />

          <StoryForm />

          {/* FOCUS QUESTIONS */}
          {inputs.additionalInputs.length > 0 ? <Modules inputs={inputs.additionalInputs} /> : null}
        </div>
      </div>
    </>
  );
};

export default Story;
