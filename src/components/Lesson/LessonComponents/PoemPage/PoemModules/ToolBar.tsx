import React, { useState, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';

interface ToolBarProps {
    editMode: {
        open: boolean;
        input: string;
    },
    setEditMode: React.Dispatch<React.SetStateAction<{
        open: boolean;
        input: string;
    }>>
}

const ToolBar = (props: ToolBarProps) => {
    const { editMode, setEditMode } = props;
    const { state, dispatch } = useContext(LessonContext);
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
        <div className="w-full md:h-7/10 bg-gray-700 flex flex-col items-center text-gray-200 shadow-2 px-4 py-2 rounded-sm">
            <div className="mb-4 w-full">
                <h3 className="w-full text-xl text-gray-200 font-open font-bold mb-4 border-b border-gray-900">Toolbox</h3>
                <h3 className="text-lg font-bold font-open mb-2">My word bank:</h3>
                <input id="search" className="pl-2 mb-2 rounded-lg shadow-elem-dark text-gray-700  text-sm bg-gray-200" type="text" value={search} placeholder="Search..." onChange={handleChange}/>
                <div className="w-full h-40 md:h-16 bg-gray-300 flex flex-col shadow-elem-dark text-gray-500 px-4 rounded-lg overflow-scroll">
                    { 
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
                    }
                </div>
            </div>
        </div>
    )
}

export default ToolBar;