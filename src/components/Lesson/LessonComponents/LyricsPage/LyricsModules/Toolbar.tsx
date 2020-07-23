import React, { useContext, useState } from 'react';
import { IconContext } from "react-icons";
import { FaEraser } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';

interface ToolbarProps {
    setColor: React.Dispatch<React.SetStateAction<string>>
}

const ToolBar = (props: ToolbarProps) => {
    const { setColor } = props;
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
        <div className="bg-gray-500 h-80 w-full flex flex-col items-center p-4 shadow-2 rounded-b my-4 md:my-0">
            <h3 className="w-full text-xl text-gray-200 font-open font-bold mb-2 border-b border-white">Toolbox</h3>
            <div className="w-full text-lg text-gray-200 font-open font-bold my-2">
                Highlighters:
            </div>
            <div className="cursor-pointer flex flex-row md:flex-wrap justify-center items-center mb-2">
                {

                    buttons.map((button: {color: string, icon: string}, key: number) => (
                            <div key={key} id={button.color} className={`bg-${button.color} h-12 w-12 text-3xl rounded-lg mb-2 mx-2 shadow-3 flex flex-row justify-center items-center`} onClick={handleClick}>
                                {button.icon}
                            </div>
                    ))
                }
                    <div id="" className={`bg-gray-200 h-12 w-12 text-3xl rounded-lg mb-2 mx-2 shadow-3 flex flex-row justify-center items-center`} onClick={handleClick}>
                        <IconContext.Provider value={{ color: 'darkgray', size: '2rem'}}>
                            <FaEraser />
                        </IconContext.Provider>
                    </div>
            </div>
            <div className="w-full h-40">
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
            </div>
        </div>
    )
}

export default ToolBar;