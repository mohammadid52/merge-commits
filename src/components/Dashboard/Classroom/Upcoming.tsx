import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaClock, FaUserAlt } from 'react-icons/fa';
import {CurriculumInfo} from './Classroom';

interface UpcomingProps{
    curriculum: Array<CurriculumInfo>
}

const UpcomingClass: React.FC<UpcomingProps> = (props: UpcomingProps) => {
    const {curriculum} = props;
    const history = useHistory();
    const { theme } = useContext(GlobalContext);

    // const curriculumLessonTest = 
    //     curriculum.map(( lesson: {title: string, artist: {id: string, images: any, name: string, type: string}, summary: string} ) => {
    //         return (
    //             value.lesson
    //             // console.log(value.lesson.artist, 'lesson')
    //     )

            
    //     })

    // const slice = curriculum.slice(1, 2);
    const curriculumLesson = 
    curriculum ? curriculum.map((  value: any, index: number, array: CurriculumInfo[] ) => {
        return (
            value.lesson
        )  
    }) : []

    useEffect(() => {
        setLessons(curriculumLesson);
        // curriculum;
    }, [props])

    
    

    // make sure to limit (max 5?) when fetching from data
    const [lessons, setLessons] = useState(curriculumLesson.slice(1,2));

    const setOpen = () => {
        setLessons( lessons.map( (lesson: {title: string, artist: {id: string, images: any, name: string, type: string}, language: string, summary: string}, i: number) => {
            return {
                ...lesson,
                open: false
            }
        }));

    }

    const toggle = (key: number) => {
        setOpen();
        
        setLessons( lessons.map( (lesson: {title: string, artist: {id: string, images: any, name: string, type: string}, language: string, summary: string, open: boolean}, i: number) => {
            if (i === key) {
                lesson.open = !lesson.open
            } 
            return lesson;
        }));
    }

    // const handleLink = () => {
    //     history.push('/lesson');
    // }

    return (
            <div className={`relative test ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} w-full h-auto flex flex-col mb-8 p-2 pt-4`}>        
                <span style={{left: '50%', top: -20, transform: 'translateX(-50%)', textShadow:'1px 1px 2px #000000'}}
                className="absolute p-5 sm:h-8 w-64 flex justify-center items-center text-center rounded-md text-sm sm:text-2xl font-bold leading-5 bg-ketchup text-white bg-opacity-90">
                Upcoming Lessons
                </span>
                  
                
                { lessons ? lessons.map( (lesson: {title: string, artist: {id: string, images: any, name: string, type: string}, language: string, summary: string, open: boolean}, i: number) => 
                (
                    <div key={i} className="py-2 px-4">
                    <button 
                        key={i}
                        onClick={() => toggle(i)} 
                        className={`relative cursor-pointer focus:outline-none flex justify-between items-center bg-dark text-xl text-gray-200 font-medium font-open px-8 shadow-elem-light`}>
                        <div className="w-8.5/10 flex justify-between my-1">
                            <div className="w-auto">
                                {lesson.title} 
                            </div>
                            {/* <div className="w-auto">
                                {lesson.lessonDate}
                            </div> */}
                        </div>
                        <div className="absolute w-8 flex items-center mr-8" style={{right: 0}}>
                            <span key={i} className={`${lesson.open === true ? 'display opacity-100 ease-in duration-100' : 'hidden opacity-0 ease-out duration-100' } w-auto h-auto opacity-100 ease-in duration-200 absolute inset-0 flex items-center justify-center transition-opacity`}>
                            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 12 12">
                                <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" />
                            </svg>
                            </span>
                            <span className={`${lesson.open === true ? 'hidden opacity-0 ease-out duration-100' : 'display opacity-100 ease-in duration-100'} w-auto h-auto opacity-0 ease-out duration-100 absolute inset-0 flex items-center justify-center transition-opacity`}>
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
                                    {/* <div className="w-1/2">
                                        <IconContext.Provider value={{ size: '1rem' }}>
                                            <FaClock />
                                        </IconContext.Provider>
                                    </div> */}
                                    {/* <div className={`w-1/2 mx-2 text-sm`}>
                                        {lesson.lessonTime} min.
                                    </div> */}
                                </div>
                                <div className={`flex my-1`} >
                                    {/* <div className="w-1/2">
                                        <IconContext.Provider value={{ size: '1rem' }}>
                                            <FaUserAlt />
                                        </IconContext.Provider>
                                    </div> */}
                                    {/* <div className={`w-1/2 mx-2 text-sm`}>
                                        {lesson.instructor}
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                        : null}
                    </div>
                )
                ) : null }
                
            </div>
    )
}

export default UpcomingClass;