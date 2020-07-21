import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import Banner from './Banner';
import Toolbar from './Toolbar';
import LyricsBlock from './LyricsBlock';
import InstructionBlock from './InstructionBlock';
import VideoBlock from './VideoBlock';
import InstructionsPopup from '../../../Popup/InstructionsPopup';

type SelectObject = {
        id?: string | number
        anchor: string 
        focus: string
        color: string
        content: Array<{ id: string | number, text: string }>,
}

const Body = () => {
    const { state, dispatch } = useContext(LessonContext)
    const [ color, setColor ] = useState('')
    const [ selected, setSelected ] = useState<Array<SelectObject>>( state.componentState.lyrics && state.componentState.lyrics.selected ? state.componentState.lyrics.selected : [])
    const [ cookies, setCookie ] = useCookies(['lyrics'])
    const [ fullscreen, setFullscreen ] = useState(false)
    const { video, link } = state.data.coreLesson.instructions
    const [ openPopup, setOpenPopup ] = useState(false)

    useEffect(() => {
        if ( cookies.lyrics ) {
            dispatch({
                type: 'SET_INITIAL_COMPONENT_STATE',
                payload: {
                    name: 'lyrics',
                    content: {
                        selected: cookies.lyrics
                    },
                }
            })

            setSelected(cookies.lyrics)
        }

        if ( !cookies.lyrics && !state.componentState.lyrics ) {
            dispatch({
                type: 'SET_INITIAL_COMPONENT_STATE',
                payload: {
                    name: 'lyrics',
                    content: {
                        selected: [],
                    },
                }
            })

            setCookie('lyrics', []);
        }
    }, [])

    useEffect(() => {
        // console.log('state', state.componentState);
        // console.log('selected', selected);
        // console.log('cookies', cookies);
        
        if ( state.componentState.lyrics ) {
            dispatch({
                type: 'UPDATE_COMPONENT_STATE',
                payload: {
                    componentName: 'lyrics',
                    inputName: 'selected',
                    content: selected
                }
            })

            setCookie('lyrics', selected)
        }
    }, [selected])

    return (
        <>
            <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup}/> 
            <div className="w-full h-full flex flex-col items-center">
                <Banner />
                <div className="w-full md:h-8/10 flex flex-col-reverse md:flex-row justify-around items-center content-center">
                    <div className="h-full flex flex-col-reverse md:flex-col md:w-7/10 md:mr-2 text-gray-200">
                        <VideoBlock link={state.data.coreLesson.content.link} fullscreen={fullscreen} />
                        <LyricsBlock color={color} selected={selected} setSelected={setSelected} fullscreen={fullscreen} setFullscreen={setFullscreen}/>
                    </div>
                    <div className="h-full md:w-3/10 md:ml-2">
                        <InstructionBlock />
                        <Toolbar setColor={setColor} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Body;