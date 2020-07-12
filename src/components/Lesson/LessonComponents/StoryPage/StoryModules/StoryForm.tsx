import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';


const StoryForm = () => {
    const { state, dispatch } = useContext(LessonContext)
    const [ cookies, setCookie ] = useCookies(['story']);
    const [ input, setInput ] = useState({
        title: state.componentState.story && state.componentState.story.title ?  state.componentState.story.title : '',
        story: state.componentState.story &&state.componentState.story.story ? state.componentState.story.story : '',
    })

    useEffect(() => {
        if ( cookies.story ) {
            setInput(() => {
                return {
                    title: cookies.story.title,
                    story: cookies.story.story
                }
            })
        }
    }, [])


    useEffect(() => {
        if ( state.componentState.story ) {

            dispatch({
                type: 'UPDATE_COMPONENT_STATE',
                payload: {
                    componentName: 'story',
                    inputName: 'title',
                    content: input.title
                }
            })

            setCookie('story', {...cookies.story, title: input.title})
        }
    }, [input.title])

    useEffect(() => {
        if ( state.componentState.story ) {

            dispatch({
                type: 'UPDATE_COMPONENT_STATE',
                payload: {
                    componentName: 'story',
                    inputName: 'story',
                    content: input.story
                }
            })

            setCookie('story', {...cookies.story, story: input.story })
        }
    }, [input.story])
   
    const handleInputChange = (e: { target: { id: string; value: string; }; }) => {
        setInput({
            ...input,
            [e.target.id]: e.target.value
        })
    }
    

    return (
        <div className="bg-dark-blue w-full h-full px-8 py-4 flex flex-col text-gray-200 shadow-2 rounded-sm">
            <h3 className="text-xl font-open font-bold mb-3 border-b border-gray-700">Story</h3>
            <div className="flex flex-col mb-5 mt-2">
                <label className="text-lg mb-2" htmlFor="title">
                    Title
                </label>
                <input id="title" className="w-88 text-xl px-4 py-2 mb-4 rounded-lg shadow-2 text-gray-700 bg-gray-300" name="title" type="text" placeholder="La Llorona" value={input.title} onChange={handleInputChange}/>
                <textarea id="story" className="w-full h-120 text-xl p-4 rounded shadow-2 text-gray-700 bg-gray-300" name="story" placeholder="Write your story here!" value={input.story} onChange={handleInputChange}/>
            </div>
        </div>
    )
}

export default StoryForm;