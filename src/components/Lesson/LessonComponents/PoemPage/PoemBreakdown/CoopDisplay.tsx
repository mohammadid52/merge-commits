import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import Banner from './Banner';
import ReflectionQuestions from './ReflectionQuestions';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaExpand, FaCompress } from 'react-icons/fa';
import PoemOutput from './PoemOutput';


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
    const displayProps = state.componentState.poem;
    const [fullscreen, setFullscreen] = useState(false);
    const student = state.displayData.studentInfo;

    const [teacherData, setTeacherData] = useState<teacherData>();

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
        if (state.displayData && state.displayData.breakdownComponent && state.displayData.breakdownComponent === 'activity/breakdown') {
            // console.log( 'got it', state.displayData );
            setTeacherData(state.displayData)
        }
    }, [state.displayData])

    useEffect(() => {
        dispatch({ type: 'ACTIVATE_LESSON', payload: 'activity/breakdown' })
    }, [])

    return (
        <div className={theme.section}>
            


                <ReflectionQuestions />


                {/* self display */}
                <div className={`${fullscreen ? 'hidden' : 'w-full'}  h-full flex flex-col justify-between items-center`}>
                    <Banner title={displayProps ? displayProps.title : null}
                        display="SELFinCOOP" fullscreen={fullscreen} />

                    <PoemOutput poem={typeof displayProps !== 'undefined' ? displayProps.editInput : 'Your Poem :)'} />
                </div>



                {/* teacher display */}
                <div className={`relative ${fullscreen ? 'w-full' : 'w-full'} h-full rounded-lg border bg-white bg-opacity-20`}>
                    <div className="absolute top-2 right-0 cursor-pointer w-full text-xl m-2" onClick={handleFullscreen}>
                        <IconContext.Provider value={{ color: '#E2E8F0', size: '2rem', style: { width: 'auto', right: '0', bottom: '0', position: 'absolute' } }}>
                            {fullscreen ? < FaCompress /> : < FaExpand />}
                        </IconContext.Provider>
                    </div>
                    <div className="w-full h-full flex flex-col justify-between items-center p-1">
                        
                            <Banner title={teacherData && teacherData.activityData && teacherData.activityData.title ? teacherData.activityData.title : null}
                                fullscreen={fullscreen}
                                display="COOP" />

                            <div className="absolute w-full z-50 top-0 transform -translate-y-1/2">
                                <div className="w-2.5/10 h-auto w-auto mx-auto py-1 px-2 bg-yellow-300 text-gray-800 font-light text-center flex flex-col justify-center items-center font-medium rounded-xl shadow-elem-dark z-50">
                                    <p>by: {student ? student.preferredName ? student.preferredName : student.firstName : null} {student ? firstInitialFunc(student.lastName) : null}</p>
                                </div>
                            </div>



                        <PoemOutput poem={typeof teacherData !== 'undefined' ? teacherData.activityData.editInput : 'Classmates Poem :)'} />

                    </div>
                </div>



        </div>
    )
};

export default CoopDisplay;