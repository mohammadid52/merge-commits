import React, { useReducer, useEffect, useState, } from 'react';
import { lessonState } from '../state/LessonState'
import { lessonReducer } from '../reducers/LessonReducer'
import { pageThemes } from './GlobalContext';
import { useCookies } from 'react-cookie';
import * as customMutations from '../customGraphql/customMutations';
import * as customQueries from '../customGraphql/customQueries';
import { API, graphqlOperation } from 'aws-amplify';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';

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
    const location = useLocation();

    const lightSwitch = () => {
        setLightOn(prev => {
            return !prev
        })
    }

    const theme = lightOn ? pageThemes.light : pageThemes.dark;

    async function getOrCreateStudentData() {
        let queryParams = queryString.parse(location.search)
        let studentID = cookies.auth.email

        try {
            const studentData: any = await API.graphql(graphqlOperation(customQueries.getStudentData, {
                classroomID: queryParams.id,
                studentID: studentID,
            }))

            console.log(studentData)

            if ( !studentData.data.getStudentData ) {
                const newStudentData: any = await API.graphql(graphqlOperation(customMutations.createStudentData, { input: {
                    lessonProgress: 'intro',
                    status: 'ACTIVE',
                    live: false,
                    classroomID: queryParams.id,
                    studentID: studentID,
                }}))
                console.log(newStudentData)
                return setData(newStudentData.data.createStudentData)
            } return setData(studentData.data.getStudentData)

        } catch (err) {
            console.error(err);
        }

        
        // console.log('student data', newStudentData);
    }

    async function getClassroom() {
        let queryParams = queryString.parse(location.search)
        let studentID = cookies.auth.email
        try {
            // this any needs to be changed once a solution is found!!!
            const classroom: any = await API.graphql(graphqlOperation(customQueries.getClassroom, { id: queryParams.id }))
            console.log('classroom data', classroom);
            setLesson(classroom.data.getClassroom)
            getOrCreateStudentData()
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
        getClassroom()

        return function cleanup() { dispatch({ type: 'CLEANUP' })};
    }, []);

    useEffect(() => {
        if (lesson) {
            // console.log('lesson'lesson);
            const wordBank: Array<string> = ['Mimo provoz'];

            dispatch({
                type: 'SET_INITIAL_STATE', 
                payload: { 
                    pages: lesson.lessonPlan, 
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
                initialComponentState[item.type] = data[item.stage]
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