import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ReflectionQuestions from '../../ReflectionQuestions';
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
    const displayProps = state.componentState.truthGame;
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

                <Banner title={state.data.lesson.warmUp.title}
                            display='SELF' fullscreen={fullscreen}/>
                <div className="w-full flex justify-between items-center" style={{height: '73%'}}>
                    
                    {/* self display */}
                    <div className={`${fullscreen ? 'hidden' : 'w-4.85/10'} h-full flex flex-col justify-between items-center`}>
                        

                        <div className="w-full h-full flex flex-col justify-between">
                            <div className={`h-full bg-gradient-to-tl from-dark-blue to-med-dark-blue ${displayProps.additional ? 'md:w-full' : 'w-full'} md:mb-0 overflow-y-auto overflow-x-hidden h-7.83/10 p-4 md:p-6 items-center text-md md:text-xl text-gray-200 rounded-lg`}>
                                {/* bg-lighter-blue shadow-inner-box  */}
                                <div className={`h-full rounded-lg font-light text-xl`}>
                                {displayProps.truthGameArray.map((item: {id: string, label: string, isLie: boolean, text: string}, key: number) => {
                                    return (
                                        <div className={`p-4`}>
                                            
                                            <div className={`text-2xl`}>
                                                {`${item.label}:`} 
                                            </div>
                                            <span className={`${item.isLie ? 'text-lg' : 'hidden'}`}> (this is your lie 🤥)</span>
                                            <div className={`text-xl`}>
                                                {item.text}
                                            </div>
                                        </div>
                                    )
                                })}
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
                            <div className="relative">

                                <div className="absolute w-auto z-50" style={{bottom: '-15px', right: 0, }}>
                                    <div className="bg-yellow-300 text-gray-800 font-light text-center flex flex-col justify-center items-center h-auto w-auto py-1 px-2 font-medium rounded-xl shadow-elem-dark z-50">
                                    <p>by: { student ? student.preferredName ? student.preferredName : student.firstName : null } { student ? firstInitialFunc(student.lastName) : null}</p>
                                    </div>
                                </div>

                            </div>
                            

                            <div className="w-full h-full flex md:flex-col justify-between">
                                <div className={`bg-gradient-to-tl from-dark-blue to-med-dark-blue ${ teacherData &&teacherData.warmUpData && teacherData.warmUpData.additional ? 'md:h-7.85/10' : 'h-full'} ${fullscreen ? 'text-lg md:text-2xl' : 'text-md md:text-xl'} md:mb-0 overflow-y-auto overflow-x-hidden w-full p-4 md:p-6 items-center text-gray-200 rounded-lg shadow-2`}>
                                    {/* bg-lighter-blue shadow-inner-box  */}
                                    <div className={`${fullscreen ? 'text-3xl' : 'text-xl'} h-full rounded-lg font-light`}>
                                        {/* { teacherData && teacherData.warmUpData && teacherData.warmUpData.truthGame } */}
                                        {teacherData && teacherData.warmUpData && teacherData.warmUpData.truthGame.truthGameArray.map((item: {id: string, label: string, isLie: boolean, text: string}, key: number) => {
                                            return (
                                                <div className={`p-4`}>
                                                    
                                                    <div className={`text-2xl`}>
                                                        {`${item.label}:`} 
                                                    </div>
                                                    <div className={`text-xl`}>
                                                        {item.text}
                                                    </div>
                                                </div>
                                            )
                                            
                                        })}
                                        {console.log(teacherData, 'teacherData')}
                                    </div>
                                </div>
                                <Modules 
                                    additional={ teacherData &&teacherData.warmUpData && teacherData.warmUpData.additional ? teacherData.warmUpData.additional : null}
                                    displayMode = "COOP" />
                            </div>
                        </div>
                    </div>

                </div>
                <ReflectionQuestions questions={state.data.lesson.warmUp.breakdown.reflectionQuestions}  />
            </div>
        )
    }


export default CoopDisplay;