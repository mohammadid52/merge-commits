import React, { useContext, useState } from 'react';
import { IconContext } from "react-icons";
import { FaEraser } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';

interface ToolbarProps {
    setColor: React.Dispatch<React.SetStateAction<string>>,
    fullscreen: boolean
}

const ToolBar = (props: ToolbarProps) => {
    const { setColor, fullscreen } = props;
    const { state, dispatch } = useContext(LessonContext);
    const [ search, setSearch ] = useState('');
    const buttons = state.data.coreLesson.tools;

    const handleClick = (e: any) => {
        setColor(e.target.id);
    }

    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearch(e.target.value)
    }

    const handleDrop = (e: { preventDefault: () => void; dataTransfer: { getData: (arg0: string) => string; }; }) => {
        e.preventDefault();

        const wordId = e.dataTransfer.getData('wordId');
        const word = document.getElementById(wordId).innerText;
        
        if (state.word_bank.indexOf(word) < 0) {
            dispatch({type: 'ADD_WORD', payload: word})
        }
    }

    const handleDragOver = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    }


    return (
        <div className="bg-gray-500 h-1.8/10 w-full p-4 shadow-2 rounded-lg flex flex-col items-center justify-around">
            <h3 className="w-auto text-xl text-gray-200 font-open font-bold border-b border-white">Highlighters</h3>
            <div className="w-auto cursor-pointer flex flex-row justify-center items-center pt-2">
               
                {

                    buttons.map((button: {color: string, icon: string}, key: number) => (
                            <div key={key} id={button.color} className={`bg-${button.color} ${fullscreen ? 'h-12 w-12 text-3xl' : 'h-8 w-8 text-md'} rounded-lg mb-2 mx-4 shadow-elem-dark flex flex-row justify-center items-center`} onClick={handleClick}>
                                {button.icon}
                            </div>
                    ))
                }
                    <div id="" className={`${fullscreen ? 'h-12 w-12 text-3xl' : 'h-8 w-8 text-md'} bg-gray-200 rounded-lg mb-2 mx-4 shadow-elem-dark flex flex-row justify-center items-center`} onClick={handleClick}>
                        <IconContext.Provider value={{ color: 'darkgray', size: '2rem'}}>
                            <FaEraser />
                        </IconContext.Provider>
                    </div>
            </div>
            {/* <div>
                1. click on the colored icon you want to use
                2. click on the words you want to Highlighter
                3. to undo your highlighting, click on the erase icon and click on the words
            </div> */}
            {/* <div className="w-full h-40">
                <h3 className="text-gray-200 text-lg font-bold font-open mb-2">My word bank:</h3>
                <input id="search" className="pl-2 mb-2 rounded-lg shadow-3 text-gray-700 bg-gray-200" type="text" value={search} placeholder="Search..." onChange={handleChange}/>
                <div className="w-full h-16 md:h-10 bg-gray-300 flex flex-col shadow-3 text-gray-500 px-4 overflow-scroll" onDrop={handleDrop} onDragOver={handleDragOver}>
                        { 
                            search === '' ? state.word_bank.map((word: string, key: string) => (
                                <span id={key} key={key}>
                                    { word }
                                </span>
                            )) 
                            : state.word_bank.map((word: string, key: string) => {
                                if (word.indexOf(search) > -1) {
                                    return (
                                        <span id={key} key={key}>
                                            { word }
                                        </span>
                                    )
                                }
                            })
                        }
                </div>
            </div> */}
        </div>
    )
}

export default ToolBar;