import React, { useEffect, useContext, useState } from 'react';
import ReflectionQuestions from './ReflectionQuestions';
import Banner from './Banner';
import { LessonContext } from '../../../../../contexts/LessonContext';
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
    const { dispatch, theme, state } = useContext(LessonContext)
    const [ modules, setModules ] = useState<Array<any>>()
    const displayProps = state.componentState.lyrics.selected
    const { artist, title } = state.data.lesson.coreLesson.content 
    const moduleTypes = state.data.lesson.coreLesson.tools
    const [fullscreen, setFullscreen] = useState(false);
    const student = state.displayData.studentInfo;

    const [ teacherData, setTeacherData ] = useState<teacherData>();
    const [ teacherModules, setTeacherModules ] = useState<Array<any>>()

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

    const arrayParseToString = (arr: Array<Array<{[key: string]: any}>>) => {
        let resultArray = arr.map((item: Array<{ text: string, [key: string]: any}>) => {
            let parsedString = ''
            item.forEach((item: { text: string, [key: string]: any}) => {
                parsedString = parsedString + item.text
            })
            return parsedString
        })
        return resultArray
    }

    useEffect(() => {
        if (displayProps) {
            let modulesArray = moduleTypes.map((item: {[key: string]: any}) => {
                let contentArray = displayProps.filter((selection: { color: string, content: any }) => {
                    return item.color === selection.color
                })
                .map((selection: { content: any}) => {
                    return selection.content
                });

                return {
                    name: item.name,
                    label: item.icon,
                    color: item.color,
                    content: arrayParseToString(contentArray)
                }
            })

            setModules(modulesArray)
        }

        dispatch({type: 'ACTIVATE_LESSON', payload: 'corelesson/breakdown'})
    }, [])

    useEffect(() => {
        if ( state.displayData && state.displayData.breakdownComponent && state.displayData.breakdownComponent === 'corelesson/breakdown' ) {
            console.log( 'got it', state.displayData );
            setTeacherData(state.displayData)
        }
    }, [state.displayData])

    useEffect(() => {
        console.log(teacherData);
        if (teacherData && teacherData.corelessonData && teacherData.corelessonData.selected ) {
            let modulesArray = moduleTypes.map((item: {[key: string]: any}) => {
                let contentArray = teacherData.corelessonData.selected.filter((selection: { color: string, content: any }) => {
                    return item.color === selection.color
                })
                .map((selection: { content: any}) => {
                    return selection.content
                });

                return {
                    name: item.name,
                    label: item.icon,
                    color: item.color,
                    content: arrayParseToString(contentArray)
                }
            })

            console.log(modulesArray);
            

            setTeacherModules(modulesArray)
        }
    }, [teacherData])

    // ${key === 0 ? 'md:mr-2' : key === modules.length - 1 ? 'md:ml-2' : 'md:mx-2'}

    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <Banner title={title} artist={artist}/>

            {/* self view */}
            <div className="h-7.2/10 w-full flex flex-col justify-between items-center">

                <div className={`${fullscreen ? 'hidden' : 'h-4.7/10'} w-full flex flex-col md:flex-row justify-between items-center`}>
                    {   modules && modules.length >= 1 ?
                        modules.map((module: any, key: number) => (
                            <div key={key} className={`${theme.gradient.cardBase} h-full w-3.27/10 text-gray-200 flex flex-col flex-no-wrap items-center p-2 rounded-lg`}>
                                <div className="w-full flex flex-row justify-between items-center pb-2 border-b border-white border-opacity-10">
                                    <div className={`w-8 h-8 p-2 text-lg rounded-lg bg-${module.color} flex justify-center items-center shadow-2`}>
                                        { module.label }
                                    </div>
                                    <div className="w-full pl-4 text-gray-200 font-open text-lg font-light"> 
                                        { module.name } 
                                    </div>
                                </div>
                                <div className="w-full md:my-2 flex flex-col overflow-y-auto overflow-x-hidden px-2">
                                    { module.content.map((line: string, key: number)=> (
                                        <p key={key} className={`text-sm text-gray-200 font-light`}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))
                        : null
                    }
                </div>

                {/* teacher view */}
                <div className={`relative ${fullscreen ? 'h-full' : 'h-4.85/10'}  w-full rounded-lg border  bg-darker-blue p-4`}>
                    
                    <div className="absolute w-auto z-50" style={{top: '-24px', right: 0, }}>
                        <div className="bg-yellow-300 text-gray-800 font-light text-center flex flex-col justify-center items-center h-auto w-auto py-1 px-2 font-medium rounded-xl shadow-elem-dark z-50">
                            <p>by: {student.preferredName} {firstInitialFunc(student.lastName)}</p>
                        </div>
                    </div>

                    <div className="absolute cursor-pointer w-full text-xl m-2" style={{bottom: 0, right: 0}} onClick={handleFullscreen}>
                        <IconContext.Provider value={{ color: '#E2E8F0', size: '2rem', style: {width: 'auto', right: '0', bottom: '0', position: 'absolute'} }}>
                            {fullscreen ? < FaCompress /> :< FaExpand />}
                        </IconContext.Provider>
                    </div>
                    <div className="h-full w-full flex flex-col md:flex-row justify-between items-center">
                    {   teacherModules && teacherModules.length >= 1 ?
                        teacherModules.map((module: any, key: number) => (
                            <div key={key} className={`${theme.gradient.cardBase} h-full w-3.27/10 text-gray-200 flex flex-col flex-no-wrap items-center p-2 rounded-lg`}>
                                <div className="w-full flex flex-row justify-between items-center pb-2 border-b border-white border-opacity-10">
                                    <div className={`${fullscreen ? 'text-2xl w-10 h-10' : 'text-lg w-8 h-8'} p-2 rounded-md bg-${module.color} flex justify-center items-center shadow-2`}>
                                        { module.label }
                                    </div>
                                    <div className={`${fullscreen ? 'text-xl' : 'text-lg'} w-full pl-4 text-gray-200 font-open font-light`}> 
                                        { module.name } 
                                    </div>
                                </div>
                                <div className="w-full md:my-2 flex flex-col overflow-y-auto overflow-x-hidden px-2">
                                    { module.content.map((line: string, key: number)=> (
                                        <p key={key} className={`${fullscreen ? 'text-lg' : 'text-sm'} font-light text-gray-200`}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))
                        : null
                    }
                    </div>
                </div>

            </div>

            <ReflectionQuestions />
        </div>
    )
}

export default CoopDisplay;