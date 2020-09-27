import React, { useState, useEffect } from 'react';
import {
    Link
} from 'react-router-dom'
import Today from '../Classroom/TodayLesson';
import Upcoming from '../Classroom//Upcoming';
import Completed from '../Classroom/Completed';
import * as customQueries from '../../../customGraphql/customQueries';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import Loading from '../../Lesson/Loading/ComponentLoading';
import Dashboard from '../Classroom/Dashboard';

export interface Artist {
    id: string
    images: []
    name: string
    type: string
}

export interface CurriculumInfo {
    artist: Artist
    language: string
    summary: string
    title: string
}

const LessonPlanHome = () => {
    const [curriculum, setCurriculum] = useState<CurriculumInfo>();
    const [listCurriculum, setListCurriculum] = useState<Array<CurriculumInfo>>();
    const [status, setStatus] = useState('');

    async function getCourse(id: string) {
        try {
            const courses: any = await API.graphql(graphqlOperation(customQueries.getCourse, { id: '1' }))
            const nextLesson = courses.data.getCourse.curriculum.lessons.items[0].lesson;
            const lessonsInfo = courses.data.getCourse.curriculum.lessons.items;
            setStatus('done');
            setCurriculum(nextLesson);
            setListCurriculum(lessonsInfo);
        } catch (error) {
            console.error(error);  
        }
    }

    useEffect(() => {
        getCourse('1')
    }, [])

    if ( status !== 'done') {
        return (
            <Loading />
        )
    }
    {

    return (
        <div className={`w-full h-9.28/10 md:h-auto flex flex-col p-4 md:p-8`}>
            <Today link="/lesson-control?id=1" curriculum={curriculum}/>
            {/* <Link to="/lesson-control?id=1">
                Teacher View 
            </Link> */}
            <Upcoming curriculum={listCurriculum}/>
            <Dashboard /> 
        </div>
    )
        }
}

export default LessonPlanHome;