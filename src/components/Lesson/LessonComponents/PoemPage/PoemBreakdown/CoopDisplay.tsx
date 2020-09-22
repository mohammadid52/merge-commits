import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import Banner from './Banner';
import ReflectionQuestions from './ReflectionQuestions';
import { IconContext } from "react-icons";
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
    const displayProps = state.componentState.poem;
    const [fullscreen, setFullscreen] = useState(false);

    const [ teacherData, setTeacherData ] = useState<teacherData>();

    const handleFullscreen = () => {
        setFullscreen(fullscreen => {
            return !fullscreen
        });
    }

    useEffect(() => {
        if ( state.displayData && state.displayData.breakdownComponent && state.displayData.breakdownComponent === 'activity/breakdown' ) {
            console.log( 'got it', state.displayData );
            setTeacherData(state.displayData)
        }
    }, [state.displayData])

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'activity/breakdown'})
    }, [])

    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <div className="h-8.3/10 flex justify-between items-center">

            {/* self display */}
            <div className={`${fullscreen ? 'hidden' : 'w-4.8/10'}  h-full flex flex-col justify-between items-center`}>
                <Banner title={displayProps ? displayProps.title : null} 
                    display="SELFinCOOP" fullscreen={fullscreen}/>

                <div className="w-full h-8.8/10 flex flex-col justify-between items-center">
                    <div className={`${theme.gradient.cardBase} w-full h-full p-6 flex flex-col items-center text-xl text-gray-200 rounded-lg whitespace-pre-wrap overflow-y-auto overflow-x-hidden`}>
                        {/* bg-lighter-blue shadow-inner-box  */}
                        <div className="p-4 h-full rounded-lg">
                        { displayProps ? displayProps.editInput : null}
                        </div>
                    </div>
                </div>
            </div>

            {/* teacher display */}
            <div className={`relative ${fullscreen ? 'w-full' : 'w-4.85/10 '} h-full rounded-lg border shadow-inner-dark bg-darker-blue p-4`}>
                <div className="absolute cursor-pointer w-full text-xl m-2" style={{bottom: 0, right: 0}} onClick={handleFullscreen}>
                    <IconContext.Provider value={{ color: '#E2E8F0', size: '2rem', style: {width: 'auto', right: '0', bottom: '0', position: 'absolute'} }}>
                        {fullscreen ? < FaCompress /> :< FaExpand />}
                    </IconContext.Provider>
                </div>
                <div className="w-full h-full flex flex-col justify-between items-center">
                    <div className="relative h-1/10">
                        <Banner title={teacherData && teacherData.activityData &&teacherData.activityData.title  ? teacherData.activityData.title : null} 
                            fullscreen={fullscreen}
                            display="COOP" />

                        {/* <div className="absolute w-auto z-50" style={{bottom: '-15px', right: 0, }}>
                            <div className="bg-yellow-300 text-gray-800 text-center flex flex-col justify-center items-center h-auto w-auto py-1 px-2 font-medium rounded-xl shadow-elem-dark z-50">
                                <p>by: student name</p>
                                <p>{state.displayData.breakdownComponent}</p>
                            </div>
                        </div> */}

                    </div>

                    <div className="w-full h-8.8/10 flex flex-col justify-between items-center">
                        <div className={`${fullscreen ? 'text-3xl' : 'text-xl'} bg-dark-blue w-full h-full p-6 flex flex-col items-center text-gray-200 rounded-lg whitespace-pre-wrap overflow-y-auto overflow-x-hidden`}>
                            {/* bg-lighter-blue  shadow-inner-box */}
                            <div className="p-4 h-full rounded-lg">
                            { teacherData && teacherData.activityData && teacherData.activityData.editInput ? teacherData.activityData.editInput : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            </div>
            <ReflectionQuestions />
        </div>
    )
};

export default CoopDisplay;