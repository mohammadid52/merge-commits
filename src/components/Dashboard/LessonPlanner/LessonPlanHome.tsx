import React from 'react';
import {
    Link
} from 'react-router-dom'
import Class from '../Classroom/Class';
import Upcoming from '../Classroom//Upcoming';
import Completed from '../Classroom/Completed';

const LessonPlanHome = () => {
    return (
        <div className={`w-full h-9.28/10 md:h-auto flex flex-col p-4 md:p-8`}>
            <Class link="/lesson-control?id=1" />
            {/* <Link to="/lesson-control?id=1">
                Teacher View 
            </Link> */}
            <Upcoming />
            <Completed />
        </div>
    )
}

export default LessonPlanHome;