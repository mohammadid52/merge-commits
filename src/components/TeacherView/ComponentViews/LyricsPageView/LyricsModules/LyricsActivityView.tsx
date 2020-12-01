import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
// import { useCookies } from 'react-cookie';
import Banner from './Banner';
import Toolbar from './Toolbar';
import LyricsBlock from './LyricsBlock';
import InstructionBlock from './InstructionBlock';
import VideoBlock from './VideoBlock';
import InstructionsPopup from '../../../../Lesson/Popup/InstructionsPopup';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import { studentObject } from '../../../../../state/LessonControlState';

type SelectObject = {
    id?: string | number
    anchor: string 
    focus: string
    color: string
    content: Array<{ id: string | number, text: string }>,
}

export interface SelectedTextGroup {
    [key: string]: {
        color: string;
        selected: string[];
    };
}

export interface FinalText {
    [key: string]: string[];
}

interface props {
    fullscreen: boolean;
    fullscreenInstructions: boolean;
}

const Body = (props: props) => {
    const { fullscreen, fullscreenInstructions } = props
    const { state, theme, dispatch } = useContext(LessonControlContext)
    const [color, setColor] = useState('')
    const [selected, setSelected] = useState<Array<SelectObject>>([])
    const [fullscreenLyrics, setFullscreenLyrics] = useState(false)
    const { video, link } = state.data.lesson.coreLesson.instructions
    const [openPopup, setOpenPopup] = useState(false)

    const [finalText, setFinalText] = useState<FinalText>({});
    const [initialSelectedText, setInitialSelectedText] = useState<SelectedTextGroup>({});
    const [selectGroup, setSelectGroup] = useState<number>(0);

    const convertRawSelectedArrayToObject = (array: Array<{ color: string, selected: string[] }>) => {
        let initialSelectedTextObject: { [key: string]: { color: string, selected: string[] }} = {}

        array.forEach((object: { color: string, selected: string[] }, key: number) => {
            initialSelectedTextObject[`group${key}`] = object
        })

        return initialSelectedTextObject
    }

    let displayStudentData = state.studentViewing.live ? state.studentViewing.studentInfo.currentLocation ? state.studentViewing.studentInfo.currentLocation === 'corelesson' : state.studentViewing.studentInfo.lessonProgress === 'corelesson' : false;

    useEffect(() => {
        if (displayStudentData) {
            if (state.studentViewing.studentInfo.corelessonData && state.studentViewing.studentInfo.corelessonData.selected) {
                return setSelected(state.studentViewing.studentInfo.corelessonData.selected)
            } return setSelected([])
        }
        
    }, [state.studentViewing]);

    useEffect(() => {
        if (displayStudentData) {
            if ( state.studentViewing.studentInfo.corelessonData && state.studentViewing.studentInfo.corelessonData.rawSelected ) {
                return setInitialSelectedText(convertRawSelectedArrayToObject(state.studentViewing.studentInfo.corelessonData.rawSelected))
            } return setInitialSelectedText({})
        }
    }, [state.studentViewing]);


    useEffect(() => {
       console.log(initialSelectedText);
       
    }, [initialSelectedText])

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
            <div className={`${(fullscreenInstructions) ? 'absolute w-5/10 h-5/10 left-1/2 transform -translate-x-1/2 translate-y-1/2 mx-auto my-auto shadow-xl text-lg bg-light-gray p-4 rounded-xl animate-fadeIn z-50' : 'hidden'}`}>
                <InstructionBlock fullscreen={fullscreen}/>
            </div>

            
            <div className={`${(fullscreenInstructions) ? 'opacity-10' : ''} transition ease-in-out duration-500 w-full h-full max-w-256 flex flex-col mx-auto z-50`}>
               

                
               
                <Toolbar setColor={setColor} color={color} colorPicker={colorPicker} fullscreen={fullscreen} />

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
                <div className='overflow-y-scroll  rounded-xl bg-darker-gray text-gray-200'>
                    </div>
                </div>
        </>
    )
}

export default Body;