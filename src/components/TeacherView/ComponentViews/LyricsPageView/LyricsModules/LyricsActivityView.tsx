import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
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

interface props {
    fullscreen: boolean
}

const Body = (props: props) => {
    const { fullscreen } = props
    const { state, theme, dispatch } = useContext(LessonControlContext)
    const [color, setColor] = useState('')
    const [selected, setSelected] = useState<Array<SelectObject>>([])
    const [fullscreenLyrics, setFullscreenLyrics] = useState(false)
    const { video, link } = state.data.lesson.coreLesson.instructions
    const [openPopup, setOpenPopup] = useState(false)

    let displayStudentData = state.studentViewing.live ? state.studentViewing.studentInfo.lessonProgress === 'corelesson' : false;

    useEffect(() => {
        if (displayStudentData) {
            if (state.studentViewing.studentInfo.corelessonData && state.studentViewing.studentInfo.corelessonData.selected) {
                return setSelected(state.studentViewing.studentInfo.corelessonData.selected)
            } return setSelected([])
        }
    }, [state.studentViewing]);

    return (
        <>
            {/* <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup} /> */}
            <div className={theme.section}>
                <Banner fullscreen={fullscreen} />

                <div className='flex flex-col justify-between items-center'>
                    <InstructionBlock fullscreen={fullscreen} />
                    <VideoBlock link={state.data.lesson.coreLesson.content.link} fullscreenLyrics={fullscreenLyrics} />
                </div>
                <div className='relative'>
                    <Toolbar setColor={setColor} color={color} fullscreen={fullscreen} />
                    <LyricsBlock
                        color={color}
                        selected={selected}
                        setSelected={setSelected}
                        fullscreenLyrics={fullscreenLyrics}
                        setFullscreenLyrics={setFullscreenLyrics}
                        fullscreen={fullscreen}
                    />
                </div>
            </div>
        </>
    )
}

export default Body;