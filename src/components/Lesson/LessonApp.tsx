import React, { useContext, } from 'react';
import { LessonContext } from '../../contexts/LessonContext';
import Body from './Body/Body';
import Foot from './Foot/Foot';
import LessonLoading from './Loading/LessonLoading';
import LessonHeaderBar from '../Header/LessonHeaderBar';


const LessonApp = () => {
    const { state, theme } = useContext(LessonContext);

    if ( state.status !== 'loaded') {
        return (
            <LessonLoading />
        )
    }

    return (
    <div className={`${theme.bg} w-screen md:h-screen flex flex-col justify-between`} >
        <LessonHeaderBar />
        <Body />
        <Foot />
    </div>
    )
}

export default LessonApp;