import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import * as customQueries from '../../../customGraphql/customQueries';
import { API, graphqlOperation } from 'aws-amplify';
import Class from './Class';
import Upcoming from './Upcoming';
import Completed from './Completed';
import Dashboard from './Dashboard';
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
            // console.log(lessonsInfo, 'list');
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
            <div className={`w-full h-9.28/10 md:h-auto flex flex-col p-4 px-8 pb-8 pt-4 overflow-scroll md:overflow-auto`}>
                
                <p className="md:hidden text-xl text-center flex justify-center mb-4" style={{top: '0'}}>* lessons are available on PC or laptop *</p>
                {/* <div className="w-full p-4 flex justify-center items-center">
                    <div className={`w-auto h-auto border-4 border-dark p-2 px-8 bg-white shadow-container rounded-xl text-4xl text-center flex justify-center items-center font-bold`}>
                        <img style={{height: '3rem', width: 'auto', marginRight: '1rem'}} src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-Color.svg" alt="Iconoclast Artists"/>
                        <p style={{color: '#2c2f40'}}>Online Classroom</p>
                    </div>
                </div> */}
                <div className="relative w-full pb-4 flex flex-col justify-center items-center">
                    <div className={`w-36 h-36 p-2 bg-white shadow-container rounded-full text-xl text-center flex flex-col justify-center items-center font-bold`}>
                        <img style={{height: '6rem', width: 'auto', marginBottom: '2rem'}} src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Symbol.png" alt="Iconoclast Artists"/>
                        <div className="absolute z-50" style={{color: '#2c2f40', bottom: '40px'}}>
                            Classroom
                        </div>
                    </div>
                </div>
                <Class link={'/lesson?id=1'} curriculum={curriculum}/>
                <Upcoming curriculum={listCurriculum}/>
                <Dashboard />
                
            </div>
        )
    }
}

export default Classroom;