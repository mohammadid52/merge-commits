import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ReflectionQuestions from './ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';
import ListOutput from './ListOutput';

import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaExpand, FaCompress } from 'react-icons/fa';

interface teacherData {
    breakdownComponent: string,
    studentInfo?: {
        id: string
        firstName: string
        preferredName?: string
        lastName: string
    }
    doFirstData?: { [key: string]: any }
    warmUpData?: { [key: string]: any }
    corelessonData?: { [key: string]: any }
    activityData?: { [key: string]: any }
}

const CoopDisplay = () => {
    const { state, theme, dispatch } = useContext(LessonContext);
    const displayProps = state.componentState.story;
    const [fullscreen, setFullscreen] = useState(false);

    const [teacherData, setTeacherData] = useState<teacherData>();
    const student = state.displayData.studentInfo;

    const handleFullscreen = () => {
        setFullscreen(fullscreen => {
            return !fullscreen
        });
    }

    const firstInitialFunc = (str: string) => {
        if (typeof str !== 'string' || str === '') { return 'Profile' }
        let firstInitial = str.charAt(0)
        firstInitial = firstInitial.toUpperCase() + '.';
        return firstInitial;
    }

    useEffect(() => {
        dispatch({ type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown' })
    }, [])

    useEffect(() => {
        if (state.displayData && state.displayData.breakdownComponent && state.displayData.breakdownComponent === 'warmup/breakdown') {
            // console.log( 'got it', state.displayData );
            setTeacherData(state.displayData)
        }
    }, [state.displayData])

    // {console.log(state.displayData.breakdownComponent, 'state and find name')}

    return (
        <div className={theme.section}>

            <ReflectionQuestions />

            {/* teacher display */}
            <div className={`relative ${fullscreen ? 'w-full' : ''} h-full flex flex-col justify-between items-center rounded-lg border p-2 bg-white bg-opacity-20`}>

                <div className="absolute top-2 right-0 cursor-pointer w-full text-xl m-2" onClick={handleFullscreen}>
                    <IconContext.Provider value={{ color: '#E2E8F0', size: '2rem', style: { width: 'auto', right: '0', bottom: '0', position: 'absolute' } }}>
                        {fullscreen ? < FaCompress /> : < FaExpand />}
                    </IconContext.Provider>
                </div>

                <div className=" w-full z-50 top-0 ">
                    <div className="w-2.5/10 h-auto w-auto py-1 text-gray-800 font-light flex flex-col justify-center items-center z-50">
                        <p><span className='text-white'>by: <span className='font-medium text-yellow-600'>{student ? student.preferredName ? student.preferredName : student.firstName : null} {student ? firstInitialFunc(student.lastName) : null}</span></span></p>
                    </div>
                </div>

                <Banner title={teacherData && teacherData.warmUpData && teacherData.warmUpData.title ? teacherData.warmUpData.title : 'Classmates List'}
                    fullscreen={fullscreen}
                    display='COOP' />

                <div className="w-full h-8.8/10 flex md:flex-col justify-between">
                    <ListOutput list={teacherData && teacherData.warmUpData && teacherData.warmUpData.story} />
                    {/* <Modules
                        additional={teacherData && teacherData.warmUpData && teacherData.warmUpData.additional ? teacherData.warmUpData.additional : null}
                        displayMode="COOP" /> */}
                </div>

            </div>



            {/* self display */}
            <div className={`${fullscreen ? 'hidden' : 'w-full'} h-full flex flex-col justify-between items-center mb-4`}>
                <Banner title={displayProps && displayProps.title ? displayProps.title : 'Your List'}
                    display='SELFinCOOP' fullscreen={fullscreen} />

                <div className=" w-full z-50 top-0 ">
                    <div className="w-2.5/10 h-auto w-auto py-1 text-gray-800 font-light flex flex-col justify-center items-center z-50">
                        <p><span className='text-white'>by: <span className='font-medium text-blueberry'>You</span></span></p>
                    </div>
                </div>

                <div className="w-full h-8.8/10 flex flex-col justify-between">
                    <ListOutput list={displayProps.story} />
                    {/* <Modules
                        additional={displayProps.additional}
                        displayMode="SELFinCOOP" /> */}
                </div>
            </div>

        </div>
    )
}


export default CoopDisplay;