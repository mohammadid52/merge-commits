import React, { useReducer, useEffect, useState, } from 'react';
import { lessonState } from '../state/LessonState'
import { lessonReducer } from '../reducers/LessonReducer'
import { pageThemes } from './GlobalContext';
import { useCookies } from 'react-cookie';
// import * as queries from '../graphql/queries';
import * as customQueries from '../customGraphql/customQueries';
import { API, graphqlOperation } from 'aws-amplify';

export const LessonContext = React.createContext(null);

interface LessonProps {
    children: React.ReactNode;
}

interface LessonObject {
    [key: string]: any;
}

interface DataObject {
    [key: string]: any;
}

export const LessonContextProvider: React.FC = ({ children }: LessonProps) => {
    const [ data, setData ] = useState<DataObject>();
    const [ lesson, setLesson ] = useState<DataObject>();
    const [ cookies ] = useCookies(['auth']);
    const [ state, dispatch ] = useReducer(lessonReducer, lessonState);
    const [ lightOn, setLightOn ] = useState(false);

    const lightSwitch = () => {
        setLightOn(prev => {
            return !prev
        })
    }

    const theme = lightOn ? pageThemes.light : pageThemes.dark;

    async function getClass() {
        let classroomID = 1
        let studentID = cookies.auth.email
        try {
            // this any needs to be changed once a solution is found!!!
            const classroomObject: any = await API.graphql(graphqlOperation(customQueries.getClassroom, { id: 1 }))
            console.log('classdata', classroomObject)
            setLesson(classroomObject.data.getClassroom)
            const dataObject: any = await API.graphql(graphqlOperation(customQueries.getClassroomDataTest, { classroomID: classroomID, studentID: studentID }))
            console.log('stdata', dataObject);
            setData(dataObject.data.getClassroomDataTest)
        } catch (error) {
            console.error(error)
        }
    }

    // async function getClassroomData() {
        

    //     try {
    //         // this any needs to be changed once a solution is found!!!
            
            
    //         
    //     } catch (error) {
    //         console.error('classroom data error', error)
    //     }
    // }

    useEffect(() => {
        getClass()
        // getClassroomData()
        return function cleanup() { dispatch({ type: 'CLEANUP' })};
    }, []);

    useEffect(() => {
        if (lesson) {
            const wordBank: Array<string> = ['Mimo provoz'];
            const lessonPlan: any = lesson.lessonPlan
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
                type: 'SET_INITIAL_STATE', 
                payload: { 
                    pages: pagesArray, 
                    word_bank: wordBank, 
                    data: lesson,
            }})
        }
    }, [lesson])

    useEffect(() => {
        if ( data ) {
            console.log('data', data)
            let initialComponentState: any = {};
            lesson.lessonPlan.forEach((item: { type: string, stage: string}) => {
                initialComponentState[item.type] = data.data[item.stage]
            })
            dispatch({
                type: 'SET_INITIAL_COMPONENT_STATE_FROM_DB',
                payload: initialComponentState,
            })
        }
    }, [data])

    return (
        <LessonContext.Provider value={{state, dispatch, theme }}>
            { children }
        </LessonContext.Provider>
    )
}