import React, { useState, useEffect } from 'react';
import {
    Link
} from 'react-router-dom'
import Class from '../Classroom/Class';
import Upcoming from '../Classroom//Upcoming';
import Completed from '../Classroom/Completed';
import * as customQueries from '../../../customGraphql/customQueries';
import { API, graphqlOperation } from 'aws-amplify';
import LessonLoading from '../../Lesson/Loading/ComponentLoading';

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
    const [status, setStatus] = useState('');

    async function getCourse(id: string) {
        try {
            const courses: any = await API.graphql(graphqlOperation(customQueries.getCourse, { id: '1' }))
            const lessons = courses.data.getCourse.curriculum.lessons.items.pop().lesson;
            const lessonInfo = courses.data.getCourse;
            setStatus('done');
            setCurriculum(lessons);
            console.log(lessonInfo, 'lesson info')
        } catch (error) {
            console.error(error);  
        }
    }

    useEffect(() => {
        getCourse('1')
    }, [])

    if ( status !== 'done') {
        return (
            <LessonLoading />
        )
    }
    {

    return (
        <div className={`w-full h-9.28/10 md:h-auto flex flex-col p-4 md:p-8`}>
            <Class link="/lesson-control?id=1" curriculum={curriculum}/>
            {/* <Link to="/lesson-control?id=1">
                Teacher View 
            </Link> */}
            {/* <Upcoming curriculum={curriculum}/> */}
            <Completed />
        </div>
    )
}}

export default LessonPlanHome;