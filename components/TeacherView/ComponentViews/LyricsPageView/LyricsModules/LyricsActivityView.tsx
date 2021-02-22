import React, {useContext, useEffect, useState} from 'react';
// import { useCookies } from 'react-cookie';
import Toolbar from './Toolbar';
import LyricsBlock from './LyricsBlock';
import VideoBlock from './VideoBlock';
import {LessonControlContext} from '../../../../../contexts/LessonControlContext';
import InstructionBlock from "./InstructionBlock";
import { getPageLabel } from '../../../../getPageLabel';

type SelectObject = {
  id?: string | number;
  anchor: string;
  focus: string;
  color: string;
  content: Array<{ id: string | number; text: string }>;
};

export interface SelectedTextGroup {
  [key: string]: {
    color: string;
    selected: string[];
  };
}

export interface FinalText {
  [key: string]: string[];
}

interface props {
  fullscreen: boolean;
  fullscreenInstructions: boolean;
  setInstructions: React.Dispatch<React.SetStateAction<{visible: boolean, available: boolean, content: any}>>
}

const Body = (props: props) => {
  const {fullscreen, fullscreenInstructions, setInstructions} = props;
  const {state, theme, dispatch} = useContext(LessonControlContext);



  //  In the future, other components should load instructions from the server or whatever
  const instructions = <InstructionBlock fullscreen={fullscreen} />;




  const [color, setColor] = useState('');
  const [selected, setSelected] = useState<Array<SelectObject>>([]);
  const [fullscreenLyrics, setFullscreenLyrics] = useState(false);
  const { video, link } = state.data.lesson.coreLesson.instructions;
  const [openPopup, setOpenPopup] = useState(false);

  const [finalText, setFinalText] = useState<FinalText>({});
  const [initialSelectedText, setInitialSelectedText] = useState<SelectedTextGroup>({});
  const [selectGroup, setSelectGroup] = useState<number>(0);

  const convertRawSelectedArrayToObject = (array: Array<{ color: string; selected: string[] }>) => {
    let initialSelectedTextObject: { [key: string]: { color: string; selected: string[] } } = {};

    array.forEach((object: { color: string; selected: string[] }, key: number) => {
      initialSelectedTextObject[`group${key}`] = object;
    });

    return initialSelectedTextObject;
  };

  let displayStudentData = state.studentViewing.live
      ? state.studentViewing.studentInfo.currentLocation
          ? getPageLabel(state.studentViewing.studentInfo.currentLocation, state.pages) === 'corelesson'
          : state.studentViewing.studentInfo.lessonProgress === 'corelesson'
      : false;


  /*
  *
  * Function to make presence of instructions known to parent component
  * should really be put into a custom hook
  *
  * */
  useEffect(() => {
    const instructionsPresent = instructions !== null && typeof instructions !== 'undefined';

    if(instructionsPresent){
      setInstructions({
        visible: false,
        available: true,
        content: instructions
      })
    }

    return ()=>setInstructions(
        {
          visible: false,
          available: false,
          content: null
        }
    )

  }, [])


  useEffect(() => {
    if (displayStudentData) {
      if (
          state.studentViewing.studentInfo.corelessonData &&
          state.studentViewing.studentInfo.corelessonData.selected
      ) {
        return setSelected(state.studentViewing.studentInfo.corelessonData.selected);
      }
      return setSelected([]);
    }
  }, [state.studentViewing]);

  useEffect(() => {
    if (displayStudentData) {
      if (
        state.studentViewing.studentInfo.corelessonData &&
        state.studentViewing.studentInfo.corelessonData.rawSelected
      ) {
        return setInitialSelectedText(
          convertRawSelectedArrayToObject(
            state.studentViewing.studentInfo.corelessonData.rawSelected
          )
        );
      }
      return setInitialSelectedText({});
    }
  }, [state.studentViewing]);

  const colorPicker = (colorName: string): string => {
    switch (colorName) {
      case 'dark-red':
        return '#CA2222';
      case 'blueberry':
        return '#488AC7';
      case 'sea-green':
        return '#17A589';
      case 'fire-orange':
        return '#FF5733';
      case 'erase':
      default:
        return '';
    }
  };

  return (
    <>


      <div
        className={`${
          fullscreenInstructions ? 'opacity-10' : ''
        } transition ease-in-out duration-500 w-full h-full max-w-256 flex flex-row mx-auto z-50`}>
        <div className='w-auto mx-auto pr-4'>
          <VideoBlock
            link={state.data.lesson.coreLesson.content.link}
            fullscreenLyrics={fullscreenLyrics}
          />
        </div>

        <div className='flex flex-col'>
          <Toolbar
            setColor={setColor}
            color={color}
            colorPicker={colorPicker}
            fullscreen={fullscreen}
          />

          <LyricsBlock
            color={color}
            colorPicker={colorPicker}
            selected={selected}
            setSelected={setSelected}
            fullscreen={fullscreen}
            fullscreenLyrics={fullscreenLyrics}
            setFullscreenLyrics={setFullscreenLyrics}
            // firstLastSelected={firstLastSelected}
            // setFirstLastSelected={setFirstLastSelected}
            initialSelectedText={initialSelectedText}
            setInitialSelectedText={setInitialSelectedText}
            finalText={finalText}
            setFinalText={setFinalText}
            selectGroup={selectGroup}
            setSelectGroup={setSelectGroup}
          />
        </div>

      </div>
    </>
  );
};

export default Body;
