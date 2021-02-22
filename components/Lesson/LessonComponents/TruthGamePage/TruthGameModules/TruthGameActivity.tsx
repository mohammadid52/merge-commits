import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import InstructionsBlock from './InstructionBlock';
import Banner from './Banner';
import Modules from './Modules';
import InstructionsPopup from '../../../Popup/InstructionsPopup';
import TruthGameForm from './TruthGameForm';

export interface TruthInput {
  id: string;
  label: string;
  isLie: boolean;
  text: string;
}

export type TruthInputState = Array<TruthInput>;

const TruthGame = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const [cookies, setCookie] = useCookies([`lesson-${state.syllabusLessonID}`]);
  const inputs = state.data.lesson.warmUp.inputs;
  // const video = state.data.lesson.warmUp.instructions.link;
  // const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    if (!cookies[`lesson-${state.syllabusLessonID}`].truthGame && !state.componentState.truthGame) {
      let tempObj: {
        truthGameArray: TruthInputState;
        additional?: Array<{ name: string; text: string | [] }>;
      };

      tempObj = {
        truthGameArray: [],
      };

      let tempArr = inputs.truthGameInputs.map((item: { id: string; label: string }) => {
        let storageObj = {
          id: item.id,
          label: item.label,
          isLie: false,
          text: '',
        };
        return storageObj;
      });

      tempObj.truthGameArray = tempArr;

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
          name: 'truthGame',
          content: tempObj,
        },
      });

      setCookie(`lesson-${state.syllabusLessonID}`, { ...cookies[`lesson-${state.syllabusLessonID}`], truthGame: tempObj });
    }

    if (cookies[`lesson-${state.syllabusLessonID}`].truthGame) {
      dispatch({
        type: 'SET_INITIAL_COMPONENT_STATE',
        payload: {
          name: 'truthGame',
          content: cookies[`lesson-${state.syllabusLessonID}`].truthGame,
        },
      });
    }
  }, []);

  return (
      <>
        <div className={theme.section}>
          <Banner />

          <div className="flex flex-col justify-between items-center">
            <InstructionsBlock />
            {inputs.additionalInputs.length > 0 ? <Modules inputs={inputs.additionalInputs} /> : null}

            <TruthGameForm />
          </div>
        </div>
      </>
  );
};

export default TruthGame;
