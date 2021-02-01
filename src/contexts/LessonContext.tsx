import React, { useReducer, useEffect, useState, } from 'react';
import { useHistory } from 'react-router-dom';
import { lessonState, PagesType } from '../state/LessonState'
import { lessonReducer } from '../reducers/LessonReducer'
// import { useCookies } from 'react-cookie';
import * as customSubscriptions from '../customGraphql/customSubscriptions';
import * as customMutations from '../customGraphql/customMutations';
import * as customQueries from '../customGraphql/customQueries';
// import { API, graphqlOperation } from 'aws-amplify';
import { Auth } from '@aws-amplify/auth';
import API, { graphqlOperation } from '@aws-amplify/api';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { standardTheme } from './GlobalContext';
import { initRosterSyllabusLessons } from '../uniqueScripts/InitRoster_in_SyllabusLessons';

const removeDisabled = (array: PagesType):any[] => {
    let updatedArray = array.filter((item: { disabled: boolean, [key: string]: any }) => {
        return !item.disabled
    })

    return updatedArray
}

interface LessonProps {
    children: React.ReactNode;
}

interface LessonObject {
    [key: string]: any;
}

interface DataObject {
    [key: string]: any;
}

export const LessonContext = React.createContext(null);

export const LessonContextProvider: React.FC = ({ children }: LessonProps) => {
    const [data, setData] = useState<DataObject>();
    const [lesson, setLesson] = useState<DataObject>();
    // const [ cookies ] = useCookies(['auth']);
    const [state, dispatch] = useReducer(lessonReducer, lessonState);
    const location = useLocation();
    const history = useHistory();
    let subscription: any;

    const theme = standardTheme;

    async function getOrCreateStudentData() {
        let queryParams = queryString.parse(location.search)
        let studentID: string;
        let studentAuthID: string;

        await Auth.currentAuthenticatedUser()
            .then(user => {
                // console.log(user);
                studentID = user.attributes.email
                studentAuthID = user.attributes.sub
            })

        try {
            const studentData: any = await API.graphql(graphqlOperation(customQueries.getStudentData, {
                syllabusLessonID: queryParams.id,
                studentID: studentID,
            }))

            if (!studentData.data.getStudentData) {
                const newStudentData: any = await API.graphql(graphqlOperation(customMutations.createStudentData, {
                    input: {
                        lessonProgress: 'intro',
                        currentLocation: 'intro',
                        status: 'ACTIVE',
                        syllabusLessonID: queryParams.id,
                        studentID: studentID,
                        studentAuthID: studentAuthID,
                    }
                }))
                dispatch({
                    type: 'SET_STUDENT_INFO', payload: {
                        studentDataID: newStudentData.data.createStudentData.id,
                        studentUsername: newStudentData.data.createStudentData.studentID,
                        studentAuthID: newStudentData.data.createStudentData.studentAuthID
                    }
                })
                return setData(newStudentData.data.createStudentData)
            }
            dispatch({
                type: 'SET_STUDENT_INFO', payload: {
                    studentDataID: studentData.data.getStudentData.id,
                    studentUsername: studentData.data.getStudentData.studentID,
                    studentAuthID: studentData.data.getStudentData.studentAuthID
                }
            })
            return setData(studentData.data.getStudentData)

        } catch (err) {
            console.error(err);
        }


    }

    /**
     * TODO:
     *  getClassroom() has been renamed to getSyllabusLesson()  updated to use the new query 'getSyllabusLesson' instead of
     *  the deprecated 'getClassroom'
     *  ALL subscriptions will be frozen until the lessons are loading properly from the new query
     */
    async function getSyllabusLesson() {
        let queryParams = queryString.parse(location.search);
        if (Object.keys(queryParams).length && queryParams.id) {
            try {
                const classroom: any = await API.graphql(graphqlOperation(customQueries.getSyllabusLesson, { id: queryParams.id }));
                console.log('classroom data', classroom);
                setLesson(classroom.data.getSyllabusLesson)
                getOrCreateStudentData()
                subscription = subscribeToClassroom()
            } catch (error) {
                console.error(error);
            }
        } else {
            history.push('/dashboard');
        }
    }

    // TODO: rename to subscribeToSyllabusLesson
    const subscribeToClassroom = () => {
        let queryParams = queryString.parse(location.search)

        // @ts-ignore
        const syllabusLessonSubscription = API.graphql(graphqlOperation(customSubscriptions.onUpdateSyllabusLesson, { id: queryParams.id })).subscribe({
            next: (syllabusLessonData: any) => {
                const updatedLessonPlan = syllabusLessonData.value.data.onUpdateClassroom

                dispatch({
                    type: 'UPDATE_LESSON_PLAN',
                    payload: {
                        pages: removeDisabled(updatedLessonPlan.lessonPlan),
                        displayData: updatedLessonPlan.displayData,
                        viewing: updatedLessonPlan.viewing
                    }
                })

            }
        });

        dispatch({
            type: 'SET_SUBSCRIPTION',
            payload: {
                subscription: syllabusLessonSubscription,
            }
        })

        return syllabusLessonSubscription;
    }

    useEffect(() => {
        getSyllabusLesson()

        return function cleanup() {
            if (subscription) {
                subscription.unsubscribe()
            }
            dispatch({ type: 'CLEANUP' })
        };
    }, []);

    useEffect(() => {
        if (lesson) {
            const wordBank: Array<string> = ['Mimo provoz'];

            dispatch({
                type: 'SET_INITIAL_STATE',
                payload: {
                    syllabusLessonID: lesson.id,
                    data: lesson,
                    pages: removeDisabled(lesson.lessonPlan),
                    displayData: lesson.displayData,
                    word_bank: wordBank,
                    subscribeFunc: subscribeToClassroom,
                }
            })
        }
    }, [lesson])

    useEffect(() => {
        if (data) {
            let initialComponentState: any = {};
            lesson.lessonPlan.forEach((item: { type: string, stage: string }) => {
                initialComponentState[item.type] = data[item.stage]
            })
            dispatch({
                type: 'SET_INITIAL_COMPONENT_STATE_FROM_DB',
                payload: initialComponentState,
            })
        }
    }, [data])

    return (
        <LessonContext.Provider value={{
            state,
            dispatch,
            theme,
            subscription,
            subscribeToClassroom,
        }}>
            { children}
        </LessonContext.Provider>
    )
}