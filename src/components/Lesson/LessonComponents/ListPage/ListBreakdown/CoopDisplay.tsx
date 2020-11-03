import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ReflectionQuestions from './ReflectionQuestions';
import Modules from './Modules';
import Banner from './Banner';
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
    const { state, dispatch } = useContext(LessonContext);
    const displayProps = state.componentState.story;
    const [fullscreen, setFullscreen] = useState(false);

    const [ teacherData, setTeacherData ] = useState<teacherData>();
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
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown'})
    }, [])

    useEffect(() => {
        if ( state.displayData && state.displayData.breakdownComponent && state.displayData.breakdownComponent === 'warmup/breakdown' ) {
            // console.log( 'got it', state.displayData );
            setTeacherData(state.displayData)
        }
    }, [state.displayData])

    // {console.log(state.displayData.breakdownComponent, 'state and find name')}

    return (
            <div className="w-full h-full flex flex-col justify-between items-center">
                <div className="w-full h-8.3/10 flex justify-between items-center">

                    {/* self display */}
                    <div className={`${fullscreen ? 'hidden' : 'w-4.85/10'} h-full flex flex-col justify-between items-center`}>
                        <Banner title={displayProps.title}
                            display='SELFinCOOP' fullscreen={fullscreen}/>

                        <div className="w-full h-8.8/10 flex flex-col justify-between">
                            <div className={`bg-gradient-to-tl from-dark-blue to-med-dark-blue ${displayProps.additional ? 'md:w-full' : 'w-full'} md:mb-0 overflow-y-auto overflow-x-hidden h-7.83/10 p-4 md:p-6 items-center text-md md:text-xl text-gray-200 rounded-lg`}>
                                {/* bg-lighter-blue shadow-inner-box  */}
                                <div style={{'whiteSpace' : 'pre-line'}} className={`h-full rounded-lg font-light text-xl`}>
                                    { displayProps.story }
                                </div>
                            </div>
                            <Modules 
                                additional={displayProps.additional} 
                                displayMode = "SELFinCOOP" />
                        </div>
                    </div>

                    {/* teacher display */}
                    <div className={`relative ${fullscreen ? 'w-full' : 'w-4.85/10'} h-full rounded-lg border shadow-inner-dark bg-darker-blue p-4`}>
                        <div className="w-full h-full flex flex-col justify-between items-center">
                            <div className="absolute cursor-pointer w-full text-xl m-2" style={{bottom: 0, right: 0}} onClick={handleFullscreen}>
                                <IconContext.Provider value={{ color: '#E2E8F0', size: '2rem', style: {width: 'auto', right: '0', bottom: '0', position: 'absolute'} }}>
                                    {fullscreen ? < FaCompress /> :< FaExpand />}
                                </IconContext.Provider>
                            </div>
                            <div className="relative h-1/10">
                                <Banner title={teacherData && teacherData.warmUpData && teacherData.warmUpData.title ? teacherData.warmUpData.title : null} 
                                fullscreen={fullscreen}
                                display='COOP'/>

                                <div className="absolute w-auto z-50" style={{bottom: '-15px', right: 0, }}>
                                    <div className="bg-yellow-300 text-gray-800 font-light text-center flex flex-col justify-center items-center h-auto w-auto py-1 px-2 font-medium rounded-xl shadow-elem-dark z-50">
                                    <p>by: { student ? student.preferredName ? student.preferredName : student.firstName : null } { student ? firstInitialFunc(student.lastName) : null}</p>
                                    </div>
                                </div>

                            </div>
                            

                            <div className="w-full h-8.8/10 flex md:flex-col justify-between">
                                <div className={`bg-gradient-to-tl from-dark-blue to-med-dark-blue ${ teacherData &&teacherData.warmUpData && teacherData.warmUpData.additional ? 'md:h-7.85/10' : 'h-full'} ${fullscreen ? 'text-lg md:text-2xl' : 'text-md md:text-xl'} md:mb-0 overflow-y-auto overflow-x-hidden w-full p-4 md:p-6 items-center text-gray-200 rounded-lg shadow-2`}>
                                    {/* bg-lighter-blue shadow-inner-box  */}
                                    <div style={{'whiteSpace' : 'pre-line'}} className={`${fullscreen ? 'text-3xl' : 'text-xl'} h-full rounded-lg font-light`}>
                                        { teacherData && teacherData.warmUpData && teacherData.warmUpData.story }
                                    </div>
                                </div>
                                <Modules 
                                    additional={ teacherData && teacherData.warmUpData && teacherData.warmUpData.additional ? teacherData.warmUpData.additional : null}
                                    displayMode = "COOP" />
                            </div>
                        </div>
                    </div>

                </div>
                <ReflectionQuestions />
            </div>
        )
    }


export default CoopDisplay;