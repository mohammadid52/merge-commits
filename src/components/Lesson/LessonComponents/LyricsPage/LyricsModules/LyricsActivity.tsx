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
  const [ cookies, setCookie ] = useCookies([`lesson-${state.classroomID}`]);
  const [fullscreen, setFullscreen] = useState(false);
  const { video, link } = state.data.lesson.coreLesson.instructions;
  const [openPopup, setOpenPopup] = useState(false);
  //  text
  // const [firstLastSelected, setFirstLastSelected] = useState<string[]>([]);
  const [finalText, setFinalText] = useState<FinalText>({});
  const [initialSelectedText, setInitialSelectedText] = useState<SelectedTextGroup>({});
  const [selectGroup, setSelectGroup] = useState<number>(0);

  const initialSelectedObjectToArray = (obj: any) => {
    if ( typeof obj === 'object' ) {
      let selectionArray: Array<{color: string, selected: string[]}> = [];
      let keyArray = Object.keys(obj)
      keyArray.forEach((key: string) => {
        selectionArray.push(obj[key])
      })
      return selectionArray
    }
  }
  
  useEffect(() => {
    if ( cookies[`lesson-${state.classroomID}`].lyrics ) {
      dispatch({
        type: 'SET_INITIAL_COMPONENT_STATE',
        payload: {
          name: 'lyrics',
          content: {
            selected: cookies[`lesson-${state.classroomID}`].lyrics,
          },
        },
      });

      setSelected(cookies[`lesson-${state.classroomID}`].lyrics.selected);
      setInitialSelectedText(cookies[`lesson-${state.classroomID}`].lyrics.rawSelected);
      setSelectGroup(parseInt(cookies[`lesson-${state.classroomID}`].lyrics.selectGroup));
    }

    if ( !cookies[`lesson-${state.classroomID}`].lyrics && !state.componentState.lyrics ) {
      
      dispatch({
        type: 'SET_INITIAL_COMPONENT_STATE',
        payload: {
          name: 'lyrics',
          content: {
            selected: [],
            selectGroup: 0,
            rawSelected: {}
          },
        },
      });

      setCookie(`lesson-${state.classroomID}`, {
        ...cookies[`lesson-${state.classroomID}`],
        lyrics: {
          selected: [],
          selectGroup: 0,
          rawSelected: {}
        }
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

      setCookie(`lesson-${state.classroomID}`, {
        ...cookies[`lesson-${state.classroomID}`],
        lyrics: {
          ...cookies[`lesson-${state.classroomID}`].lyrics,
          selected: selected,
        }
      })

      setCookie(`lesson-${state.classroomID}`, {
        ...cookies[`lesson-${state.classroomID}`],
        lyrics: {
          ...cookies[`lesson-${state.classroomID}`].lyrics,
          rawSelected: initialSelectedText,
          selectGroup: selectGroup,
        }
      })

    }
  }, [selected]);

  /**
   * COOKIE loading for previously highlighted text WOOO!!!
   */

  return (
    <>
      {/* <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup} /> */}
      <div className={theme.section}>
        <Banner />

        <div className='z-50 z-100 flex flex-col justify-between items-center'>
          <InstructionBlock />
          <VideoBlock link={state.data.lesson.coreLesson.content.link} fullscreen={fullscreen} />
        </div>

        <div className='relative'>
          {/* Toolbar becomes sticky */}
          <Toolbar setColor={setColor} color={color}/>
            <LyricsBlock
              color={color}
              selected={selected}
              setSelected={setSelected}
              fullscreen={fullscreen}
              setFullscreen={setFullscreen}
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
