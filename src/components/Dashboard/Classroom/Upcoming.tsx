import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from "react-icons";
import { FaClock, FaUserAlt } from 'react-icons/fa';
import {CurriculumInfo} from './Classroom';

interface UpcomingProps{
    curriculum: Array<CurriculumInfo>
}

const UpcomingClass: React.FC<UpcomingProps> = (props: UpcomingProps) => {
    const {curriculum} = props;
    const history = useHistory();
    const { theme } = useContext(GlobalContext);

    // make sure to limit (max 5?) when fetching from data
    const [lessons, setLessons] = useState([
        {
            title: 'The Rose That Grew from Concrete',
            artist: {
                id: '',
                images: ['https://zoiqclients.s3.amazonaws.com/IconoclastArtist/AppFiles/LessonPlans/2_TheRoseThatGrewFromTheConcrete/Tupac-Shakur-1993.jpg'],
                name: 'Tupac Shakur',
                type: ''
            },
            instructor: 'Marlon',
            lessonTime: '45',
            lessonDate: 'Sept 22nd',
            summary: "In this lesson we will be exploring self awareness and the beautiful things about us that others might miss or consider imperfections using Tupac Shakur's poem to explore this idea about how to recognize our emotions and thoughts and how they influence our behavior.",
            open: false,
        },
        {
            title: 'OCD Love poem',
            artist: {
                id: '',
                images: ['https://media2.fdncms.com/chicago/imager/u/original/40711495/neil_poster_2016-1_1_copy.jpg'],
                name: 'Neil Hilborn',
                type: ''
            },
            instructor: 'Marlon',
            lessonTime: '45',
            lessonDate: 'Sept 29th',
            summary: '',
            open: false,
        },
        {
            title: 'Be Free',
            artist: {
                id: '',
                images: ['https://static.onecms.io/wp-content/uploads/sites/20/2020/07/21/j-cole.jpg'],
                name: 'J. Cole',
                type: ''
            },
            instructor: 'Marlon',
            lessonTime: '45',
            lessonDate: 'Oct 6th',
            summary: '',
            open: false,
        }
    ]);

    console.log(curriculum, 'upcoming curr')

    const toggle = (key: number) => {
        setLessons( lessons.map( (lesson: {title: string, artist: {id: string, images: any, name: string, type: string}, instructor: string, lessonTime: string, summary: string, lessonDate: string, open: boolean}, i: number) => {
            if (i === key) {
                lesson.open = !lesson.open
            } 
            return lesson;
        }));
    }

    const handleLink = () => {
        history.push('/lesson');
    }


    return (
            <div className={`relative test ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} w-full h-auto flex flex-col mb-8 p-2`}>        
                <span style={{left: 0, top: -20}}
                className="absolute right-0 ml-4 p-4 sm:h-8 bg-opacity-60 w-auto inline-flex items-center rounded-md text-sm sm:text-2xl font-extrabold leading-5 text-purple-800">
                Upcoming Lessons
                </span>
                  
                
                { lessons.map( (lesson: {title: string, artist: {id: string, images: any, name: string, type: string}, instructor: string, lessonTime: string, summary: string, lessonDate: string, open: boolean}, i: number) => 
                (
                    <div key={i} className="py-2 px-4">
                    <button 
                        key={i}
                        onClick={() => toggle(i)} 
                        className={`relative cursor-pointer focus:outline-none flex justify-between items-center bg-dark text-xl text-gray-200 font-bold font-open px-8 shadow-elem-light`}>
                        <div className="w-8.5/10 flex justify-between my-1">
                            <div className="w-auto">
                                {lesson.title} 
                            </div>
                            <div className="w-auto">
                                {lesson.lessonDate}
                            </div>
                        </div>
                        <div className="absolute w-auto flex items-center mr-8" style={{right: 0}}>
                            <span key={i} className={`${lesson.open === false ? 'hidden opacity-0 ease-out duration-100' : 'display opacity-100 ease-in duration-100'} w-auto h-auto opacity-100 ease-in duration-200 absolute inset-0 flex items-center justify-center transition-opacity`}>
                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 12 12">
                                <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" />
                            </svg>
                            </span>
                            <span className={`${lesson.open === false ? 'display opacity-100 ease-in duration-100' : 'hidden opacity-0 ease-out duration-100'} w-auto h-auto opacity-0 ease-out duration-100 absolute inset-0 flex items-center justify-center transition-opacity`}>
                            <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"  />
                            </svg>
                            </span>
                        </div>
                    </button>
                    { lesson.open ? 

                    <div className={`flex flex-col pt-2 md:flex-row justify-around items-center`}>
                        <div className={`block1 w-1/5 h-full flex flex-col items-center text-center`}>
                            <h2 className={`text-xl font-open font-bold mb-2`}>
                                {lesson.artist.name}
                            </h2>
                            <img className="h-24 w-24 shadow-elem-light" src={`${lesson.artist.images}`} alt={`${lesson.artist.name}`} style={{backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}/>
                        </div>
                        <div className={`block2 w-1/2 h-full flex flex-col`}>
                            <h2 className={`text-lg font-bold font-open md:mb-2`}>
                                Lesson Description
                            </h2>
                            <p className="text-sm">
                                {lesson.summary ? lesson.summary : 'No Information Available'}
                            </p>
                        </div>
                        
                        <div className={`block3 w-2/10 h-full flex flex-col-reverse justify-end items-center my-4`}>

                            <div className={`w-full`}>
                                <div className={`flex my-1`} >
                                    <div className="w-1/2">
                                        <IconContext.Provider value={{ size: '1rem' }}>
                                            <FaClock />
                                        </IconContext.Provider>
                                    </div>
                                    <div className={`w-1/2 mx-2 text-sm`}>
                                        {lesson.lessonTime} min.
                                    </div>
                                </div>
                                <div className={`flex my-1`} >
                                    <div className="w-1/2">
                                        <IconContext.Provider value={{ size: '1rem' }}>
                                            <FaUserAlt />
                                        </IconContext.Provider>
                                    </div>
                                    <div className={`w-1/2 mx-2 text-sm`}>
                                        {lesson.instructor}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        : null}
                    </div>
                )
                )}
                
            </div>
    )
}

export default UpcomingClass;