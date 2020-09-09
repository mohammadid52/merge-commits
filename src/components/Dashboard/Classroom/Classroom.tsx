import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import * as customQueries from '../../../customGraphql/customQueries';
import { API, graphqlOperation } from 'aws-amplify';
import Class from './Class';
import Upcoming from './Upcoming';
import Completed from './Completed';
import Loading from '../../Lesson/Loading/ComponentLoading';

interface Artist {
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

const Classroom: React.FC = () => {
    const history = useHistory();
    const { theme } = useContext(GlobalContext);
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

    const handleLink = () => {
        history.push('/lesson');
    }

    if ( status !== 'done') {
        return (
            <Loading />
        )
    }
    {
        return (
            <div className={`w-full h-9.28/10 md:h-auto flex flex-col p-4 md:p-8`}>
                <Class link={'/lesson?id=1'} curriculum={curriculum}/>
                <Upcoming />
                <Completed />
            </div>
        )
    }
}

export default Classroom;