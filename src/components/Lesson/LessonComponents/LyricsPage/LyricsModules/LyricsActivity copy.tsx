import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import Banner from './Banner';
import Toolbar from './Toolbar';
import LyricsBlock from './LyricsBlock';
import InstructionBlock from './InstructionBlock';
import VideoBlock from './VideoBlock';
import InstructionsPopup from '../../../Popup/InstructionsPopup';

/**
 * interfaces
 */
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

const Body = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const [color, setColor] = useState('');
  const [selected, setSelected] = useState<Array<SelectObject>>(
    state.componentState.lyrics && state.componentState.lyrics.selected
      ? state.componentState.lyrics.selected
      : []
  );
  const [cookies, setCookie] = useCookies([`lesson-${state.syllabusLessonID}`]);
  const [fullscreen, setFullscreen] = useState(false);
  const { video, link } = state.data.lesson.coreLesson.instructions;
  const [openPopup, setOpenPopup] = useState(false);
  //  text
  // const [firstLastSelected, setFirstLastSelected] = useState<string[]>([]);
  const [finalText, setFinalText] = useState<FinalText>({});
  const [initialSelectedText, setInitialSelectedText] = useState<SelectedTextGroup>({});
  const [selectGroup, setSelectGroup] = useState<number>(0);

  const initialSelectedObjectToArray = (obj: any) => {
    if (typeof obj === 'object') {
      let selectionArray: Array<{ color: string; selected: string[] }> = [];
      let keyArray = Object.keys(obj);
      keyArray.forEach((key: string) => {
        selectionArray.push(obj[key]);
      });
      return selectionArray;
    }
  };

  useEffect(() => {
    if (cookies[`lesson-${state.syllabusLessonID}`].lyrics) {
      dispatch({
        type: 'SET_INITIAL_COMPONENT_STATE',
        payload: {
          name: 'lyrics',
          content: {
            selected: cookies[`lesson-${state.syllabusLessonID}`].lyrics,
          },
        },
      });

      setSelected(cookies[`lesson-${state.syllabusLessonID}`].lyrics.selected);
      setInitialSelectedText(cookies[`lesson-${state.syllabusLessonID}`].lyrics.rawSelected);
      setSelectGroup(parseInt(cookies[`lesson-${state.syllabusLessonID}`].lyrics.selectGroup));
    }

    if (!cookies[`lesson-${state.syllabusLessonID}`].lyrics && !state.componentState.lyrics) {
      dispatch({
        type: 'SET_INITIAL_COMPONENT_STATE',
        payload: {
          name: 'lyrics',
          content: {
            selected: [],
            selectGroup: 0,
            rawSelected: {},
          },
        },
      });

      setCookie(`lesson-${state.syllabusLessonID}`, {
        ...cookies[`lesson-${state.syllabusLessonID}`],
        lyrics: {
          selected: [],
          selectGroup: 0,
          rawSelected: {},
        },
      });
    }
  }, []);

  useEffect(() => {
    if (state.componentState.lyrics) {
      dispatch({
        type: 'UPDATE_COMPONENT_STATE',
        payload: {
          componentName: 'lyrics',
          inputName: 'selected',
          content: selected,
        },
      });

      dispatch({
        type: 'UPDATE_COMPONENT_STATE',
        payload: {
          componentName: 'lyrics',
          inputName: 'rawSelected',
          content: initialSelectedObjectToArray(initialSelectedText),
        },
      });

      setCookie(`lesson-${state.syllabusLessonID}`, {
        ...cookies[`lesson-${state.syllabusLessonID}`],
        lyrics: {
          ...cookies[`lesson-${state.syllabusLessonID}`].lyrics,
          selected: selected,
        },
      });

      setCookie(`lesson-${state.syllabusLessonID}`, {
        ...cookies[`lesson-${state.syllabusLessonID}`],
        lyrics: {
          ...cookies[`lesson-${state.syllabusLessonID}`].lyrics,
          rawSelected: initialSelectedText,
          selectGroup: selectGroup,
        },
      });
    }
  }, [selected]);

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

  /**
   * COOKIE loading for previously highlighted text WOOO!!!
   */

  return (
    <>
      <div className='relative max-w-256 h-full flex flex-row overflow-hidden mx-auto'>
        
        <div className='w-3/10 h-full mr-4'>
          <div className='z-50 flex flex-col justify-between items-center'>
            <InstructionBlock />
          </div>
          {/* <Toolbar setColor={setColor} color={color} /> */}
          <VideoBlock link={state.data.lesson.coreLesson.content.link} fullscreen={fullscreen} />
        </div>

        <div className='w-7/10 h-full max-w-256 flex flex-col justify-between items-center z-50'>
          <Banner />

          <Toolbar setColor={setColor} color={color} colorPicker={colorPicker} />

          <div className='h-full overflow-y-scroll  rounded-xl bg-darker-gray text-gray-200'>
            <LyricsBlock
              color={color}
              colorPicker={colorPicker}
              selected={selected}
              setSelected={setSelected}
              fullscreen={fullscreen}
              setFullscreen={setFullscreen}
              initialSelectedText={initialSelectedText}
              setInitialSelectedText={setInitialSelectedText}
              finalText={finalText}
              setFinalText={setFinalText}
              selectGroup={selectGroup}
              setSelectGroup={setSelectGroup}></LyricsBlock>
          </div>
        </div>
      </div>
    </>
  );
};

export default Body;
