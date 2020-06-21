import React, { useReducer, useEffect, useState, } from 'react';
import { lessonState } from '../state/LessonState'
import { lessonReducer } from '../reducers/LessonReducer'
import { pageThemes } from './GlobalContext';
// import * as queries from '../graphql/queries';
import * as customQueries from '../customGraphql/customQueries';
import { API, graphqlOperation } from 'aws-amplify';

export const LessonContext = React.createContext(null);

interface LessonProps {
    children: React.ReactNode;
}

interface dataObject {
    [key: string]: any;
}

export const LessonContextProvider: React.FC = ({ children }: LessonProps) => {
    const [ data, setData ] = useState();
    const [ state, dispatch ] = useReducer(lessonReducer, lessonState);
    const [ lightOn, setLightOn ] = useState(false);

    const lightSwitch = () => {
        setLightOn(prev => {
            return !prev
        })
    }

    const theme = lightOn ? pageThemes.light : pageThemes.dark;

    async function getClass() {
        try {
            // this any needs to be changed once a solution is found!!!
            const classObject: any = await API.graphql(graphqlOperation(customQueries.getClass, { id: 1 }))
            setData(classObject.data.getClass)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getClass()

        return function cleanup() { dispatch({ type: 'CLEANUP' })};
    }, []);

    useEffect(() => {
        if (data){
            const wordBank: Array<string> = ['Mimo provoz'];
            const lessonPlan = data.lessonPlan;
            let pagesArray = [
                {
                    type: 'intro',
                    stage: '',
                    open: true,
                    active: true,
                },
                {
                    type: 'outro',
                    stage: 'outro',
                    open: true,
                    active: false,
                }
            ];

            lessonPlan.reverse().forEach((lesson: { breakdown: any; stage: string; type: string; }) => {
                if (lesson.breakdown) {
                    let tempBreakdown = {
                        type: 'breakdown',
                        stage: lesson.stage + '/breakdown',
                        open: true,
                        active: false,
                    }
                    pagesArray.splice(1, 0, tempBreakdown)
                }
                let tempPrimaryLesson = {
                    type: lesson.type,
                    stage: lesson.stage,
                    open: true,
                    active: false,
                }
                pagesArray.splice(1, 0, tempPrimaryLesson)

            });

            dispatch({
            type:'SET_INITIAL_STATE', 
            payload: { 
                pages: pagesArray, 
                word_bank: wordBank, 
                data: data,
            }})

        }
    }, [data])

    // console.log('state', state)

    return (
        <LessonContext.Provider value={{state, dispatch, theme }}>
            { children }
        </LessonContext.Provider>
    )
}