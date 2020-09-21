import React, { useEffect, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import PhotoBlock from './PhotoBlock';
import QuoteBlock from './QuoteBlock';
import Block from './Block';
import Banner from './Banner';
import DoFirst from './DoFirst';



const Intro = () => {
    const { dispatch } = useContext(LessonContext)

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: ''})
    }, [])


    return (
    <div className="z-50 w-full h-full flex flex-col md:flex-row justify-between items-center">
        <div className="md:w-6/10 h-full md:mr-6 flex flex-col justify-between items-center">
            <Banner />
            <div className="w-full h-4.3/10 flex animate-fadeIn">
                <QuoteBlock />
            </div>
            <div className="w-full h-4.3/10 shadow-2xlr">
                <Block />
            </div>
        </div>
        <div className="md:w-4/10 h-full flex flex-col justify-between items-center">
            <DoFirst />
        </div>
    </div>
    )
}

export default Intro;
