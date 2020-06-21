import React, { useState, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import Banner from './Banner';
import Toolbar from './Toolbar';
import LyricsBlock from './LyricsBlock';
import InstructionBlock from './InstructionBlock';
import VideoBlock from './VideoBlock';
import InstructionsPopup from '../../../Popup/InstructionsPopup';


const Body = () => {
    const { state } = useContext(LessonContext)
    const [ color, setColor ] = useState('');
    const [ selected, setSelected ] = useState([]);
    const [ fullscreen, setFullscreen ] = useState(false)
    const { video, link } = state.data.coreLesson.instructions
    const [ openPopup, setOpenPopup ] = useState(false)

    return (
        <>
            <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup}/> 
            <div className="w-full h-200 flex flex-col items-center">
                <Banner />
                <div className="h-164 w-full flex flex-row justify-around items-center content-center">
                    <div className=" w-7/10 h-164 mr-2 text-gray-200">
                        <VideoBlock link={state.data.coreLesson.content.link} fullscreen={fullscreen} />
                        <LyricsBlock color={color} selected={selected} setSelected={setSelected} fullscreen={fullscreen} setFullscreen={setFullscreen}/>
                    </div>
                    <div className="w-3/10 h-164 ml-2">
                        <InstructionBlock />
                        <Toolbar setColor={setColor} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Body;