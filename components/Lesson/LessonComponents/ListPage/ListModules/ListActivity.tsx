import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import InstructionsBlock from './InstructionBlock';
import Banner from './Banner';
import Modules from './Modules';
import InstructionsPopup from '../../../Popup/InstructionsPopup';
import ListForm from './ListForm';
import { string } from 'prop-types';

export interface StoryState {
  story: string[];
  title?: string;
  additional?: {
    name: string;
    text: string | [];
  }[];
}

const List = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const [cookies, setCookie] = useCookies([`lesson-${state.syllabusLessonID}`]);
  const [openPopup, setOpenPopup] = useState(false);

  //  Variables
  const inputs = state.data.lesson.warmUp.inputs;
  const video = state.data.lesson.warmUp.instructions.link;
  const nrLists = inputs.listInputNumber;
  const listArray = nrLists === null ? [''] : Array.from(Array(nrLists).keys()).map((elem: number) => '');

  useEffect(() => {
    if (!cookies[`lesson-${state.syllabusLessonID}`]?.story && !state.componentState.story) {
      let tempObj: StoryState = {
        story: listArray,
        additional: [
          {
            name: '',
            text: '',
          },
        ],
      };
      if (inputs.title) {
        tempObj.title = '';
      }

      //TODO: this 'additionalInputs' is causing a problem with list -> database mutations...
      // ...it clashes because 'text' does not exist on the type declaration for 'AdditionalInputsInput',
      // ...what needs to be done is an array of {name: ..., input: ...} needs to be initialized
      // ...also might need to rewrite the StoryState interface up above line 11 - 18

      // UPDATE: somehow commenting this out does not affect the standard list,
      // curious as to why it was here in the first place


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

      setCookie(`lesson-${state.syllabusLessonID}`, {
        ...cookies[`lesson-${state.syllabusLessonID}`],
        story: tempObj,
      });
    }
    if (cookies.story) {
      dispatch({
        type: 'SET_INITIAL_COMPONENT_STATE',
        payload: {
          name: 'story',
          content: cookies.story,
        },
      });
    }

  }, []);

  return (
    <>
      <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup} />
      <div className={theme.section}>
        <Banner />

        <div className="flex flex-col justify-between items-center">
          <InstructionsBlock />

          {inputs.additionalInputs.length > 0 ? <Modules inputs={inputs.additionalInputs} /> : null}

          <ListForm listArray={listArray} nrLists={nrLists} />
        </div>
      </div>
    </>
  );
};

export default List;
