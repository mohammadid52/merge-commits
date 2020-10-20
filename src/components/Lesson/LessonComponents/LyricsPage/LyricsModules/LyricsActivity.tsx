import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
// import { useCookies } from 'react-cookie';
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
  const { state, dispatch } = useContext(LessonContext);
  const [color, setColor] = useState('');
  const [selected, setSelected] = useState<Array<SelectObject>>(
    state.componentState.lyrics && state.componentState.lyrics.selected
      ? state.componentState.lyrics.selected
      : []
  );
  // const [cookies, setCookie] = useCookies(['lyrics']);
  // const [selectedCookie, setSelectedCookie] = useCookies(['selected']);
  // const [selectGroupCookie, setSelectGroupCookie] = useCookies(['selectGroup']);
  const [fullscreen, setFullscreen] = useState(false);
  const { video, link } = state.data.lesson.coreLesson.instructions;
  const [openPopup, setOpenPopup] = useState(false);
  //  text
  const [firstLastSelected, setFirstLastSelected] = useState<string[]>([]);
  const [initialSelectedText, setInitialSelectedText] = useState<SelectedTextGroup>({});
  const [finalText, setFinalText] = useState<FinalText>({});
  const [selectGroup, setSelectGroup] = useState<number>(0);

  useEffect(() => {
    // if (cookies.lyrics) {
    //   dispatch({
    //     type: 'SET_INITIAL_COMPONENT_STATE',
    //     payload: {
    //       name: 'lyrics',
    //       content: {
    //         selected: cookies.lyrics,
    //       },
    //     },
    //   });

    //   setSelected(cookies.lyrics);
    // }

    if (
      // !cookies.lyrics &&
      !state.componentState.lyrics
      ) {
      dispatch({
        type: 'SET_INITIAL_COMPONENT_STATE',
        payload: {
          name: 'lyrics',
          content: {
            selected: [],
          },
        },
      });
    }
    //   setCookie('lyrics', []);
    // }
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
      // setCookie('lyrics', selected);
    }
  }, [selected]);

  /**
   * COOKIE loading for previously highlighted text WOOO!!!
   */

  // useEffect(()=>{
  //   if(typeof selectedCookie.selected !== 'undefined') {
  //       setInitialSelectedText(selectedCookie.selected);
  //       setSelectGroup(parseInt(selectGroupCookie.selectGroup));
  //   }
  // },[])

  useEffect(()=>{
    // setSelectGroupCookie('selectGroup', selectGroup)
  },[selectGroup])

  useEffect(()=>{
    // setSelectedCookie('selected', JSON.stringify(initialSelectedText))
  },[initialSelectedText])

  return (
    <>
      <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup} />
      <div className='w-full h-full flex flex-col justify-between items-center'>
        <Banner />
        <div className='w-full md:h-8.8/10 flex flex-col-reverse md:flex-row justify-between items-center content-center'>
          <div className='h-full flex flex-col justify-between md:w-4.8/10 text-gray-200'>
            <InstructionBlock />
            <VideoBlock link={state.data.lesson.coreLesson.content.link} fullscreen={fullscreen} />
          </div>
          <div className='h-full md:w-5.1/10 flex flex-col justify-between items-center'>
            <Toolbar setColor={setColor} />
            <LyricsBlock
              color={color}
              selected={selected}
              setSelected={setSelected}
              fullscreen={fullscreen}
              setFullscreen={setFullscreen}
              firstLastSelected={firstLastSelected}
              setFirstLastSelected={setFirstLastSelected}
              initialSelectedText={initialSelectedText}
              setInitialSelectedText={setInitialSelectedText}
              finalText={finalText}
              setFinalText={setFinalText}
              selectGroup={selectGroup}
              setSelectGroup={setSelectGroup}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Body;
