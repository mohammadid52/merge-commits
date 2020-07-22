import React, { useEffect, useContext, useState } from 'react';
import ReflectionQuestions from './ReflectionQuestions';
import Banner from './Banner';
import { LessonContext } from '../../../../../contexts/LessonContext';

const LyricsBreakdown = () => {
    const { dispatch, state } = useContext(LessonContext)
    const [ modules, setModules ] = useState<Array<any>>()
    const displayProps = state.componentState.lyrics.selected
    const { artist, title } = state.data.coreLesson.content
    const moduleTypes = state.data.coreLesson.tools

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

    

    return (
        <div className="w-full py-4 flex flex-col justify-center items-center">
            <Banner title={title} artist={artist}/>
            <div className="h-full w-full flex flex-col md:flex-row justify-between items-center mb-5">
                {   modules && modules.length >= 1 ?
                    modules.map((module: any, key: number) => (
                        <div key={key} className={`bg-dark-blue mb-4 md:mb-0 h-64 md:h-80 w-full text-gray-200 flex flex-col flex-no-wrap items-center p-4 shadow-2 rounded-sm ${key === 0 ? 'md:mr-2' : key === modules.length - 1 ? 'md:ml-2' : 'md:mx-2'}`}>
                            <div className="w-full flex flex-row justify-between items-center pb-2 border-b border-gray-700">
                                <div className={`w-12 h-12 p-2 text-3xl rounded bg-${module.color} flex justify-center items-center shadow-2`}>
                                    { module.label }
                                </div>
                                <div className="w-full text-center text-gray-200 font-open text-lg font-bold"> 
                                    { module.name } 
                                </div>
                            </div>
                            <div className="w-full md:my-4 flex flex-col overflow-scroll px-6">
                                { module.content.map((line: string, key: number)=> (
                                    <p key={key} className={`text-sm md:text-lg text-gray-200 font-bold mb-4`}>{line}</p>
                                ))}
                            </div>
                        </div>
                    ))
                    : null
                }
            </div>
            <ReflectionQuestions />
        </div>
    )
}

export default LyricsBreakdown;