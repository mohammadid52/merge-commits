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
        <div className={`${ editMode ? 'md:h-7/10' : 'md:h-4.8/10'} ${fullscreen ? 'p-6' : 'p-3'} w-full bg-gray-700 flex flex-col items-center text-gray-200 shadow-2 rounded-lg`}>
            <div className="w-full h-full flex flex-col justify-between">
                <h3 className="w-full text-xl text-gray-200 font-open font-bold border-b border-gray-900">Toolbox</h3>
                <h3 className="h-1/10 text-lg font-bold font-open">My word bank:</h3>
                <div id="search" className="h-1/10 pl-2 rounded-lg shadow-elem-dark text-gray-700 text-sm bg-gray-200">Search...</div>
                <div className={`${ editMode ? 'h-40 md:h-6.5/10' : 'h-40 md:h-5.5/10'} w-full bg-gray-300 flex flex-col shadow-elem-dark text-gray-500 px-4 rounded-lg overflow-scroll`}>
                    {/* { 
                        search === '' ? state.word_bank.map((word: string, key: string) => (
                            <div 
                                key={key} 
                                className="text-sm w-auto"  
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                draggable>
                                    <span id={key}>
                                        { word }
                                    </span>
                            </div>
                        )) 
                        : state.word_bank.map((word: string, key: string) => {
                            if (word.indexOf(search) > -1) {
                                return (
                                   <div
                                    key={key} 
                                    className="text-sm w-auto"  
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    draggable>
                                        <span id={key}>
                                            { word }
                                        </span>
                                   </div>
                                )
                            }
                        })
                    } */}
                </div>
            </div>
        </div>
    )
}

export default ToolBar;