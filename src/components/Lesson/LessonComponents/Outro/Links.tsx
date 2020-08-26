import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import VideoBlock from './VideoBlock';

const Links = () => {
    const { state, dispatch } = useContext(LessonContext)
    const [ fullscreen, setFullscreen ] = useState(false)

    return(
        <div className="w-full h-full bg-dark-blue text-gray-200 p-4 flex flex-col justify-between items-center">
            <h3 className="h-.5/10 w-full text-xl text-gray-200 font-open font-bold">
                Learn more about the artist!
            </h3>
            <div className="h-4/10 rounded-lg">
                <VideoBlock link={state.data.coreLesson.content.link} fullscreen={fullscreen}/>
            </div>
            <div className="h-4/10 rounded-lg">
                <VideoBlock link={state.data.coreLesson.content.link} fullscreen={fullscreen}/>
            </div>
            <div className="h-1/10">
                <div>
                    check out these other platforms.. 
                </div>
                <div className="flex justify-center">
                    <div className="h-6 w-6 bg-red-100 mx-4">
                    </div>
                    <div className="h-6 w-6 bg-red-100 mx-4">
                    </div>
                    <div className="h-6 w-6 bg-red-100 mx-4">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Links;
