import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaClock, FaUserAlt } from 'react-icons/fa';


const Completed: React.FC = () => {
    const history = useHistory();
    const { theme } = useContext(GlobalContext);

    const [lessons, setLessons] = useState(null
    //     [
    //     {
    //         title: 'Where I\'m From',
    //         artist: 'Marlon Lizama',
    //         image: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/marlon.jpeg',
    //         instructor: 'Marlon',
    //         lessonTime: '45',
    //         lessonDate: 'Sept 13th',
    //         lessonDescription: 'In this lesson, we will be discussing heritage and culture in the context of stories and experiences passed down through the generations. We will be analysing and reacting to a poem by our own Marlon Lizama, called Where I am from. In reponse, you will have the opportunity to write and present your own poem too!',
    //         open: false,
    //     },
    //     {
    //         title: '2',
    //         artist: '2',
    //         image: '2',
    //         instructor: '2',
    //         lessonTime: '2',
    //         lessonDate: 'Sept 20th',
    //         lessonDescription: '2',
    //         open: false
    //     },
    //     {
    //         title: '3',
    //         artist: '3',
    //         image: '3',
    //         instructor: '3',
    //         lessonTime: '3',
    //         lessonDate: 'Sept 27th',
    //         lessonDescription: '3',
    //         open: false
    //     }
    // ]
    );

    const toggle = (key: number) => {
        setLessons( lessons.map( (lesson: {title: string, artist: string, image: string, instructor: string, lessonTime: string, lessonDescription: string, lessonDate: string, open: boolean}, i: number) => {
            if (i === key) {
                lesson.open = !lesson.open
            } 
            return lesson;
        }));
    }


    return (
            <div className={`relative shadow-container rounded-xl bg-grayscale-light text-grayscale w-full h-auto flex flex-col p-2`}>        
                <span style={{right: 0, top: -20}}
                className="absolute right-0 mr-4 p-4 sm:h-8 bg-opacity-60 w-auto inline-flex items-center rounded-md text-sm sm:text-2xl font-bold leading-5 bg-red-300 text-red-800">
                Completed Lessons
                </span>

                {lessons ? <>

                { lessons.map( (lesson: {title: string, artist: string, image: string, instructor: string, lessonTime: string, lessonDescription: string, lessonDate: string, open: boolean}, i: number) => 
                (
                    <div key={i} className="py-2 px-4">
                    <button 
                        key={i}
                        onClick={() => toggle(i)} 
                        className={`relative  bg-grayscale text-grayscale-lighter cursor-pointer focus:outline-none flex justify-between items-center bg-dark text-xl text-gray-200 font-bold font-open px-8 shadow-elem-light`}>
                        <div className="w-8.5/10 flex justify-between">
                            <div className="w-auto">
                                {lesson.title} 
                            </div>
                            <div className="w-auto">
                                {lesson.lessonDate}
                            </div>
                        </div>
                        <div className="absolute w-auto flex items-center mr-8" style={{right: 0}}>
                            <span key={i} className={`${lesson.open === false ? 'hidden opacity-0 ease-out duration-100' : 'display opacity-100 ease-in duration-100'} w-auto h-auto opacity-100 ease-in duration-200 absolute inset-0 flex items-center justify-center transition-opacity`}>
                            <svg className="h-8 w-8 text-grayscale-lighter" fill="none" viewBox="0 0 12 12">
                                <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" />
                            </svg>
                            </span>
                            <span className={`${lesson.open === false ? 'display opacity-100 ease-in duration-100' : 'hidden opacity-0 ease-out duration-100'} w-auto h-auto opacity-0 ease-out duration-100 absolute inset-0 flex items-center justify-center transition-opacity`}>
                            <svg className="h-8 w-8 text-grayscale-lighter" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"  />
                            </svg>
                            </span>
                        </div>
                    </button>
                    { lesson.open ? 

                    <div className={`flex flex-col pt-2 md:flex-row justify-around items-center`}>
                        <div className={`block1 w-1/5 h-full flex flex-col items-center text-center`}>
                            <h2 className={`text-xl font-open font-bold mb-2`}>
                                {lesson.artist}
                            </h2>
                            <img id="grey_image" className="w-24 shadow-elem-light" src={`${lesson.image}`} alt="Marlon Lizama" />
                        </div>
                        <div className={`block2 w-1/2 h-full flex flex-col`}>
                            <h2 className={`text-lg font-bold font-open md:mb-2`}>
                                Lesson Description
                            </h2>
                            <p className="text-xs">
                                {lesson.lessonDescription}
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
                        : null }
                    </div>
                )
                )} </> : 
                
                <div className="h-20 w-full flex justify-center items-center">
                    <div className="text-grayscale text-xl font-bold text-center">
                        There are no completed lessons
                    </div>
                </div> }
                  
            </div>
    )
}

export default Completed;