import React, { useState, useEffect } from 'react';
import {
    Link
} from 'react-router-dom'
import Class from '../Classroom/Class';
import Upcoming from '../Classroom//Upcoming';
import Completed from '../Classroom/Completed';
import * as customQueries from '../../../customGraphql/customQueries';
import { API, graphqlOperation } from 'aws-amplify';

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

    async function getCourse(id: string) {
        try {
            const courses: any = await API.graphql(graphqlOperation(customQueries.getCourse, { id: id }))
            const lessons = courses.data.getCourse.curriculum.lessons.items.pop();
            console.log(lessons, 'courses')
            // const userData = result.data.userById.items.pop();
            setCurriculum(lessons);
            
        } catch (error) {
            console.error(error);  
        }
    }


    return (
        <div className={`w-full h-9.28/10 md:h-auto flex flex-col p-4 md:p-8`}>
            <Class link="/lesson-control?id=1" curriculum={curriculum}/>
            {/* <Link to="/lesson-control?id=1">
                Teacher View 
            </Link> */}
            <Upcoming curriculum={curriculum}/>
            <Completed />
        </div>
    )
}

export default LessonPlanHome;