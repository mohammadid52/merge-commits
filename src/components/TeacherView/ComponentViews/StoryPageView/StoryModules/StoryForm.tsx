import React, { useState, useEffect, useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface props {   
    fullscreen: boolean
    dataProps?: {
        title?: string,
        story?: string,
        [key: string]: any
    }
}

const StoryForm = (props: props) => {
    const { theme } = useContext(LessonControlContext)
    const { fullscreen, dataProps } = props;
    const [ input, setInput ] = useState({
        title: '',
        story: ''
    })

    useEffect(() => {
        
        setInput({
            title: dataProps && dataProps.title ? dataProps.title : '',
            story: dataProps && dataProps.story ? dataProps.story : '',
        })

    }, [dataProps])

    return (
        <div className={`${fullscreen ? 'px-4 md:px-8 py-4' : 'p-2'} bg-gradient-to-tl from-dark-blue to-med-dark-blue w-full h-full flex flex-col text-dark-blue rounded-lg border-l-4 border-orange-600`}>
        <h3
          className={`text-xl text-gray-200 font-open font-light ${theme.underline}`}>
          Story{' '}
          <span className='text-gray-600 font-light text-sm ml-4'>
            (Fill in the form below!)
          </span>
        </h3>
        <div className='h-full flex flex-col mb-5 mt-2'>
          <label
            className='text-lg font-light text-base text-blue-100 text-opacity-70 mb-2'
            htmlFor='title'>
            Title
          </label>
          <input
            id='title'
            className={`${fullscreen ? 'text-sm md:text-xl px-4 py-2 mb-4' : 'text-base p-2 mb-2'} md:w-88 rounded-lg text-gray-700 bg-gray-300`}
            name='title'
            type='text'
            placeholder='La Llorona'
            defaultValue={input.title}
            // onChange={handleInputChange}
          />
          <div className='py-2 border-t border-white border-opacity-10'></div>
          <textarea
            id='story'
            className={`${fullscreen ? 'text-sm md:text-xl px-4 py-2' : 'text-base p-2'} w-full h-9/10 rounded-lg text-gray-700 bg-gray-300`}
            name='story'
            placeholder='Write your story here!'
            defaultValue={input.story}
            // onChange={handleInputChange}
          />
        </div>
      </div>


        // <div className={`${fullscreen ? 'px-4 md:px-8 py-4' : 'p-4'} bg-dark-blue w-full h-full flex flex-col text-gray-200 shadow-2 rounded-lg`}>
        //     <h3 className="text-xl font-open font-bold mb-3 border-b border-white">Story</h3>
        //     <div className="h-full flex flex-col mb-5 mt-2 justify-between">
        //         <label className="text-lg mb-2" htmlFor="title">
        //             Title
        //         </label>
        //         {/* <input id="title" className={`${fullscreen ? 'text-sm md:text-xl px-4 py-2 mb-4' : 'text-base p-2 mb-2'} md:w-88 rounded-lg shadow-2 text-gray-700 bg-gray-300`} name="title" type="text" placeholder="La Llorona" value={input.title} onChange={handleInputChange}/> */}
        //         {/* <textarea id="story" className={`${fullscreen ? 'text-sm md:text-xl p-4' : 'text-base p-2'} w-full h-9/10 rounded-lg shadow-2 text-gray-700 bg-gray-300`} name="story" placeholder="Write your story here!" value={input.story} onChange={handleInputChange}/> */}
                
        //         <input id="title" className={`${fullscreen ? 'text-sm md:text-xl px-4 py-2 mb-4' : 'text-base p-2 mb-2'} md:w-88 rounded-lg shadow-2 text-gray-700 bg-gray-300`} name="title" type="text" placeholder="La Llorona" value={input.title} readOnly />
        //         <textarea id="story" className={`${fullscreen ? 'text-sm md:text-xl p-4' : 'text-base p-2'} w-full h-8/10 rounded-lg shadow-2 text-gray-700 bg-gray-300`} name="story" placeholder="Write your story here!" 
        //         value={input.story} readOnly/>
        //     </div>
        // </div>
    )
}

export default StoryForm;