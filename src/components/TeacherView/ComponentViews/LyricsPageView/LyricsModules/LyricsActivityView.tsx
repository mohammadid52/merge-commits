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

type SelectObject = {
        id?: string | number
        anchor: string 
        focus: string
        color: string
        content: Array<{ id: string | number, text: string }>,
}

interface props {
        student: number | null,
        fullscreen: boolean
    }

const Body = (props: props) => {
    const { student, fullscreen } = props
    const { state, dispatch } = useContext(LessonControlContext)
    const [ color, setColor ] = useState('')
    const [ selected, setSelected ] = useState<Array<SelectObject>>( 
        // state.componentState.lyrics && state.componentState.lyrics.selected ? state.componentState.lyrics.selected :
         []
    )
    const [ cookies, setCookie ] = useCookies(['lyrics'])
    const [ fullscreenLyrics, setFullscreenLyrics ] = useState(false)
    const { video, link } = state.data.lesson.coreLesson.instructions
    const [ openPopup, setOpenPopup ] = useState(false)

    useEffect(() => {
        // if ( cookies.lyrics ) {
        //     dispatch({
        //         type: 'SET_INITIAL_COMPONENT_STATE',
        //         payload: {
        //             name: 'lyrics',
        //             content: {
        //                 selected: cookies.lyrics
        //             },
        //         }
        //     })

        //     setSelected(cookies.lyrics)
        // }

        // if ( !cookies.lyrics && !state.componentState.lyrics ) {
        //     dispatch({
        //         type: 'SET_INITIAL_COMPONENT_STATE',
        //         payload: {
        //             name: 'lyrics',
        //             content: {
        //                 selected: [],
        //             },
        //         }
        //     })

        //     setCookie('lyrics', []);
        // }
    }, [])

    useEffect(() => {
        // console.log('state', state.componentState);
        // console.log('selected', selected);
        // console.log('cookies', cookies);
        
        // if ( state.componentState.lyrics ) {
        //     dispatch({
        //         type: 'UPDATE_COMPONENT_STATE',
        //         payload: {
        //             componentName: 'lyrics',
        //             inputName: 'selected',
        //             content: selected
        //         }
        //     })

        //     setCookie('lyrics', selected)
        // }
    }, [selected])

    return (
        <>
            <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup}/> 
            <div className="w-full h-full flex flex-col justify-between items-center">
                <Banner fullscreen={fullscreen}/>
                <div className="w-full md:h-8.8/10 flex flex-col-reverse md:flex-row justify-between items-center content-center">
                    <div className="h-full flex flex-col justify-between md:w-4.8/10 text-gray-200">
                        <InstructionBlock fullscreen={fullscreen}/>
                        <VideoBlock link={state.data.lesson.coreLesson.content.link} fullscreenLyrics={fullscreenLyrics}/> 
                    </div>
                    <div className="h-full md:w-5.1/10 flex flex-col justify-between items-center">
                        <Toolbar setColor={setColor} fullscreen={fullscreen}/>
                        <LyricsBlock color={color} selected={selected} setSelected={setSelected} fullscreenLyrics={fullscreenLyrics} setFullscreenLyrics={setFullscreenLyrics} fullscreen={fullscreen}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Body;