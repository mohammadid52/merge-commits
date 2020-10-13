import React, { useContext, } from 'react';
import { LessonContext } from '../../contexts/LessonContext';
import Body from './Body/Body';
import Foot from './Foot/Foot';
import LessonLoading from './Loading/LessonLoading';
import LessonHeaderBar from '../Header/LessonHeaderBar';
import Branding from '../General/Branding';


const LessonApp = () => {
    const { state, theme } = useContext(LessonContext);

    if ( state.status !== 'loaded') {
        return (
            <LessonLoading />
        )
    }

    // console.log(state)

    return (
    <div className={`${theme.bg} w-screen md:h-screen flex flex-col items-start`} >
        <LessonHeaderBar />
        <Body />
        {/* <Foot /> */}
        <Branding />
    </div>
    )
}

export default LessonApp;