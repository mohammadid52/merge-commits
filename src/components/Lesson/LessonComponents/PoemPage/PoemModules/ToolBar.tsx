import React, { useState, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ToolTip from '../../../../General/ToolTip/ToolTip';

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
    const prompts = state.data.lesson.activity.writingPrompts
    // console.log(prompts, 'state');
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

    if (editMode.open) {
        return (
            <div className="text-gray-200 w-full md:h-7.8/10 bg-gradient-to-tl from-dark-blue to-med-dark-blue flex flex-col items-center px-4 py-4 rounded-lg">
                <div className='w-full flex flex-row mb-1 pb-1 border-b border-white border-opacity-10'>
                    <h3 className='text-xl text-gray-200 font-open font-light flex'>
                        Line Prompts <ToolTip width='w-40' position='bottom' header='' content='In case you want to look back at the line prompts'/>
                    </h3>
                </div>
                <div className="overflow-y-scroll px-2">
                    {prompts.map((line: {example: string, id: number, name: string, prompt: string }, key: number) => {
                        return(
                            <div className="my-1">
                                <div key={key} className="text-base font-bold">
                                    {line.prompt}
                                </div>
                                <label className={`${line.example ? 'visible' : 'invisible'} font-light flex text-gray-400 text-sm`}>
                                ( ex. {line.example} )
                                </label>
                            </div>
                        )
                        
                    })}
                </div>
            </div>
        )
    } 

    return (
        // <div className="w-full md:h-7/10 bg-gray-700 flex flex-col items-center text-gray-200 shadow-2 px-4 py-4 rounded-lg">
        //     <div className="w-full h-full flex flex-col justify-between">
        //         <h3 className="w-full h-1.5/10 text-xl text-gray-200 font-open font-bold border-b border-gray-900">Toolbox</h3>
        //         <h3 className="h-1/10 text-lg font-bold font-open">My word bank:</h3>
        //         <input id="search" className="h-1/10 pl-2 rounded-lg shadow-elem-dark text-gray-700 text-sm bg-gray-200" type="text" value={search} placeholder="Search..." onChange={handleChange}/>
        //         <div className="w-full h-40 md:h-6/10 bg-gray-300 flex flex-col shadow-elem-dark text-gray-500 px-4 rounded-lg overflow-y-auto overflow-x-hidden">
        //             { 
        //                 search === '' ? state.word_bank.map((word: string, key: string) => (
        //                     <div 
        //                         key={key} 
        //                         className="text-sm w-auto"  
        //                         onDragStart={handleDragStart}
        //                         onDragOver={handleDragOver}
        //                         draggable>
        //                             <span id={key}>
        //                                 { word }
        //                             </span>
        //                     </div>
        //                 )) 
        //                 : state.word_bank.map((word: string, key: string) => {
        //                     if (word.indexOf(search) > -1) {
        //                         return (
        //                            <div
        //                             key={key} 
        //                             className="text-sm w-auto"  
        //                             onDragStart={handleDragStart}
        //                             onDragOver={handleDragOver}
        //                             draggable>
        //                                 <span id={key}>
        //                                     { word }
        //                                 </span>
        //                            </div>
        //                         )
        //                     }
        //                 })
        //             }
        //         </div>
        //     </div>
        // </div>
        
        <div className="w-full md:h-7/10 bg-grayscale-light flex flex-col items-center text-grayscale-lighter px-4 py-4 rounded-lg">
            <div className="w-full h-full flex flex-col justify-between">
                <h3 className="w-full text-xl text-grayscale-lighter font-open font-light border-b border-grayscale-lighter pb-1 mb-1">Toolbox</h3>
                <h3 className="text-lg font-light font-open">My word bank:</h3>
                <div id="search" className="h-1/10 pl-2 rounded-lg text-grayscale text-sm bg-grayscale-lighter">Search...</div>
                <div className="w-full h-40 opacity-70 md:h-6/10 text-2xl bg-grayscale-lighter flex flex-col text-center justify-center font-light text-grayscale-lightest px-4 rounded-lg overflow-y-auto overflow-x-hidden">
                    Toolbox coming soon...
                </div>
            </div>
        </div>
    )
} 

export default ToolBar;