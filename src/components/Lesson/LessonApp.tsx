import React, { useContext, } from 'react';
import { LessonContext } from '../../contexts/LessonContext';
import Body from './Body/Body';
import Foot from './Foot/Foot';
import LessonLoading from './Loading/LessonLoading';


const LessonApp = () => {
    const { state } = useContext(LessonContext);

    if ( state.status !== 'loaded') {
        return (
            <LessonLoading />
        )
    }

    return (
        <div className="min-h-full w-screen flex flex-col justify-between" >
            <Body />
            <Foot />
        </div>
    )
}

export default LessonApp;