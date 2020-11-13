import React, { useContext, } from 'react';
import { LessonContext } from '../../contexts/LessonContext';
import Body from './Body/Body';
// import Foot from './Foot/_Foot';
import LessonLoading from './Loading/LessonLoading';
import LessonHeaderBar from '../Header/LessonHeaderBar';
import BottomMenu from '../Lesson/Foot/BottomMenu';
import Foot from './Foot/Foot';


const LessonApp = () => {
    const { state, theme } = useContext(LessonContext);

    if ( state.status !== 'loaded') {
        return (
            <LessonLoading />
        )
    }

    // console.log(state)

    return (
    <div className={`${theme.bg} w-full md:h-screen flex flex-col items-start`} >
        <LessonHeaderBar />
        <Body />
        <Foot />
    </div>
    )
}

export default LessonApp;