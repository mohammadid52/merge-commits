import React, { useState } from 'react';
import { storyBreakdownProps } from './StoryActivity';

interface storyFormProps {
    breakdownProps: storyBreakdownProps;
    setBreakdownProps: React.Dispatch<React.SetStateAction<storyBreakdownProps>>;
}

const StoryForm = (props: storyFormProps) => {
    const { breakdownProps, setBreakdownProps } = props;
    const [ input, setInput ] = useState({
        title: '',
        story: '',
    })
   
    const handleInputChange = (e: { target: { id: string; value: string; }; }) => {
        setInput({
            ...input,
            [e.target.id]: e.target.value
        })
        setBreakdownProps({
            ...breakdownProps,
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