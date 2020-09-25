import React, { useEffect, useState, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from 'react-icons';
import { FaPenFancy, FaCheckSquare } from 'react-icons/fa';
import PhotoBlock from './PhotoBlock';
import QuoteBlock from './QuoteBlock';
import Block from './Block';
import Banner from './Banner';
import DoFirst from './DoFirst/DoFirst';



const Intro = () => {
    const { dispatch, state, theme } = useContext(LessonContext)

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: ''})
    }, [])

    if ( state.data.lesson.type !== 'lesson' ) {
        return (
            <div className={`z-50 w-full h-full flex flex-col justify-between items-center`}>
                <div className={`w-full h-1/10  text-xl md:text-5xl ${theme.banner}`}>
                    <IconContext.Provider value={{ color: '#EDF2F7', size: '2.75rem'}}>
                        <div className={`red bg-dark-red h-16 w-16 flex flex-col items-center justify-center z-20 rounded-lg shadow-2 ${theme.block.shadow}`}>
                            <FaCheckSquare />
                        </div>
                    </IconContext.Provider>
                    <div className={`h-full w-full flex flex-row justify-center items-center text-5xl text-center font-open font-medium ${theme.block.text} z-10`}>
                        Title
                    </div>
                </div>

                <div className={`w-full h-8.8/10 flex flex-col ${theme.block.bg} justify-center items-center p-4 ${theme.block.text} text-base rounded-lg`}>
                    BODY GO HERE
                </div>
                
            </div>
        )
    }

    return (
    <div className="z-50 w-full h-full flex flex-col md:flex-row justify-between items-center">
        <div className="md:w-6/10 h-full md:mr-6 flex flex-col justify-between items-center">
            <Banner />
            <div className="w-full h-4.5/10 flex animate-fadeIn">
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
