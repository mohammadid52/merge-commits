import React from 'react';
import {
    Link
} from 'react-router-dom'

const LessonPlanHome = () => {
    return (
        <div>
            <Link to="/lesson-control">
                Teacher View
            </Link>
        </div>
    )
}

export default LessonPlanHome;