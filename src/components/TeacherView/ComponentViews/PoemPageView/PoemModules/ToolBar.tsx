import React, { useState, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface ToolBarProps {
    fullscreen: boolean,
    editMode: boolean,
    setEditMode: React.Dispatch<React.SetStateAction<{
        open: boolean;
        input: string;
    }>>
}

const ToolBar = (props: ToolBarProps) => {
    const { editMode, setEditMode, fullscreen } = props;
    const { state, dispatch } = useContext(LessonControlContext);
    const [ search, setSearch ] = useState('');

    const handleDragOver = (e: { stopPropagation: () => void; }) => {
        e.stopPropagation();
    }

    const handleDragStart = (e: { currentTarget: any; dataTransfer: { setData: (arg0: string, arg1: any) => void; }; }) => {
        const current = e.currentTarget;
        const text = current.querySelector('span').innerText;
        e.dataTransfer.setData('addWord', text)
    }

    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearch(e.target.value)
    }

    return (

        <div className={`${ editMode ? 'md:h-7/10' : 'md:h-4.5/10'} ${fullscreen ? 'p-4' : 'p-2'} w-full md:h-7/10 bg-grayscale-light flex flex-col items-center text-grayscale-lighter px-4 py-4 rounded-lg`}>
            <div className="w-full h-full flex flex-col justify-between">
                <h3 className={`${fullscreen ? 'text-xl' : 'text-base'} w-full text-grayscale-lighter font-open font-light border-b border-grayscale-lighter pb-1 mb-1`}>Toolbox</h3>
                <h3 className={`${fullscreen ? 'text-lg' : 'text-sm'} font-light font-open`}>My word bank:</h3>
                <div id="search" className="h-1/10 pl-2 rounded-lg text-grayscale text-sm bg-grayscale-lighter">Search...</div>
                <div className={`${fullscreen ? 'text-2xl ' : 'text-lg'} w-full h-40 opacity-70 md:h-6/10 bg-grayscale-lighter flex flex-col text-center justify-center font-light text-grayscale-lightest px-4 rounded-lg overflow-y-auto overflow-x-hidden`}>
                    Toolbox coming soon...
                </div>
            </div>
        </div>

    )
}

export default ToolBar;