import React, { useEffect, useContext, useState } from 'react';
import ReflectionQuestions from './ReflectionQuestions';
import Banner from './Banner';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface props {
    fullscreen: boolean
}

const SelfDisplay = (props: props) => {
    const { fullscreen } = props;
    const { dispatch, state } = useContext(LessonControlContext)
    const [ modules, setModules ] = useState<Array<any>>()
    const dataProps = state.studentViewing.studentInfo && state.studentViewing.studentInfo.corelessonData && state.studentViewing.studentInfo.corelessonData.selected ?  state.studentViewing.studentInfo.corelessonData.selected : []
    const { artist, title } = state.data.lesson.coreLesson.content
    const moduleTypes = state.data.lesson.coreLesson.tools

    let displayStudentData = state.studentViewing.live ? state.studentViewing.studentInfo.lessonProgress === 'corelesson/breakdown' : false;

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
        console.log('this one here', displayStudentData, dataProps, state);
        
        if ( displayStudentData && dataProps ) {
            let modulesArray = moduleTypes.map((item: {[key: string]: any}) => {
                let contentArray = dataProps.filter((selection: { color: string, content: any }) => {
                    return item.color === selection.color
                })
                .map((selection: { content: any }) => {
                    return selection.content
                });

                console.log(contentArray)

                return {
                    name: item.name,
                    label: item.icon,
                    color: item.color,
                    content: arrayParseToString(contentArray)
                }
            })

            return setModules(modulesArray)
        }
        
        let modulesArray: any = moduleTypes.map((item: {[key: string]: any}) => {
            let obj: any = {
                name: item.name,
                label: item.icon,
                color: item.color,
                content: [],
            }
            return obj
        })
        
        return setModules(modulesArray)
    }, [])

    // ${key === 0 ? 'md:mr-2' : key === modules.length - 1 ? 'md:ml-2' : 'md:mx-2'}

    return (
        <div className={`w-full h-full flex flex-col justify-between items-center`}>
            <Banner title={title} artist={artist} fullscreen={fullscreen}/>
            <div className={`h-7/10 w-full flex flex-col md:flex-row justify-between items-center`}>
                {   modules && modules.length >= 1 ?
                    modules.map((module: any, key: number) => (
                        <div key={key} className={`bg-dark-blue h-64 md:h-full w-3.27/10 text-gray-200 flex flex-col flex-no-wrap items-center p-4 shadow-2 rounded-lg`}>
                            <div className={`w-full flex flex-row justify-between items-center pb-2 border-b border-white`}>
                                <div className={`${fullscreen ? 'text-3xl w-12 h-12' : 'text-base w-4 h-4'} p-2 rounded-lg bg-${module.color} flex justify-center items-center shadow-2`}>
                                    { module.label }
                                </div>
                                <div className={`${fullscreen ? 'text-lg' : 'text-sm'} w-full pl-4 text-gray-200 font-open font-bold`}> 
                                    { module.name } 
                                </div>
                            </div>
                            <div className={`w-full md:my-4 flex flex-col overflow-scroll px-6`}>
                                { module.content.map((line: string, key: number)=> (
                                    <p key={key} className={`${fullscreen ? 'text-sm md:text-lg' : 'text-xs'} text-gray-200 font-bold mb-4`}>{line}</p>
                                ))}
                            </div>
                        </div>
                    ))
                    : null
                }
            </div>
            <ReflectionQuestions fullscreen={fullscreen}/>
        </div>
    )
}

export default SelfDisplay;