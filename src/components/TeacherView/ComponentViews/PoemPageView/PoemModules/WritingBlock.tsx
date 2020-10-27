import React, { useState, useEffect, useContext } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaPlus } from 'react-icons/fa';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import PositiveAlert from '../../../../General/Popup';

interface WritingBlockProps {
    fullscreen: boolean,
    editMode: {
        open: boolean;
        input: string;
    }
    setEditMode: React.Dispatch<React.SetStateAction<{
        open: boolean;
        input: string;
    }>>
    displayStudentData?: boolean;
}

interface lineState {
    focused: any
    prompts: Array<any>
    lines: Array<{
        id: string,
        text: string,
        example: string,
        menuOpen: boolean,
    }>
}

const WritingBlock = (props: WritingBlockProps) => {
    const { editMode, setEditMode, fullscreen, displayStudentData } = props;
    const { state, dispatch } = useContext(LessonControlContext);
    const lineNo = state.data.lesson.activity.lineNumber;
    const promptArray = state.data.lesson.activity.writingPrompts;
    const initialLines = [];
    for(let i = 0; i < lineNo; i++) {
        let tempObj = {
            id: `${i}`,
            text: '',
            example: '',
            menuOpen: false,
        }
        initialLines.push(tempObj)
    }
    const [ lineState, setLineState ] = useState<lineState>({
        focused: null,
        prompts: promptArray,
        lines: initialLines,
    });

    const [alert, setAlert] = useState(false);

    const handleCancel = () => {
        setAlert(!alert);
    }
    
    useEffect(() => {
        if ( displayStudentData && state.studentViewing.studentInfo.activityData ) {
            setLineState(lineState => {
                return {
                    ...lineState,
                    lines: state.studentViewing.studentInfo.activityData.lines
                }
            })
        }
    }, [state.studentViewing])

    useEffect(() => {
        let lineArray = lineState.lines.map((line: { text: string }) => {
            return line.text
        })

        let content = '';
        lineArray.forEach((line: string) => {
            return content = content + line + '\n'
        });

        
        setEditMode(editInput => {
            return {
                ...editInput, 
                input: content,
            }
        })

    }, [lineState])

    const closeMenus = () => {
        setLineState(lineState => {
            return {
                ...lineState,
                lines: lineState.lines.map((line: { id: string; text: string; example: string; menuOpen: boolean; }) => {
                    return {
                        ...line,
                        menuOpen: false,
                    }
                })
            }
        })
    }

    const handleAddInput = () => {
        let length = lineState.lines.length;
        if (length < (lineNo * 2)) {
            setLineState(lineState => {
            return {
                ...lineState,
                lines: lineState.lines.concat({
                    id: `${length}`,
                    text: '',
                    menuOpen: false,
                    example: '',
                })
            }
        })}
    }

    const handleDeleteInput = (e: any) => {
        let { id } = e.currentTarget;
        let length = lineState.lines.length;
        if (length > lineNo) {
            setLineState(lineState => {
                let newLines = lineState.lines.filter((line: { id: string }, key: number) => {
                    return id != line.id;
                })
                return {
                    ...lineState,
                    lines: newLines.map((line: { id: string; text: string; example: string; menuOpen: boolean; }, key: number) => {
                        return {
                            ...line,
                            id: `${key}`
                        }
                    }),
                }
            })
        }
    }

    const handleSelectPrompt = (e: { currentTarget: any; }) => {
        const current = e.currentTarget;
        let selectedId = current.querySelector('span').id;
        let selectedPrompt = lineState.prompts.filter((item: { id: string }) => {
            return item.id == selectedId
        }).pop();

        setLineState(lineState => {
            return {
                ...lineState, 
                lines: lineState.lines.map((line: { id: string; text: string; example: string; menuOpen: boolean; }, key: number) => {
                    if (line.id == current.id) {
                        return {
                            ...line, 
                            text: selectedPrompt.prompt,
                            example: selectedPrompt.example,
                        }
                    }
                    return line
                })
            }
        });

        closeMenus();
    }

    const handleMenuToggle = (e: any) => {
        const { id } = e.target;
        setLineState(lineState => {
            return {
                ...lineState,
                lines: lineState.lines.map((line: { id: string; text: string; example: string; menuOpen: boolean; }, key: number) => {
                    if (line.id == id) {
                        return {
                            ...line,
                            menuOpen: !line.menuOpen,
                        }
                    }
                    return {
                        ...line, 
                        menuOpen: false,
                    }
                })
            }
        })
    }


    const handleSubmit = () => {
        setEditMode(editMode => {
            return {
                ...editMode,
                open: true,
            }
        })
    }

    const handleInputChange = (e: any) => {
        const { id, value } = e.target;
        setLineState(lineState => {
            return {
                ...lineState,
                lines: lineState.lines.map((line: { id: string; text: string; example: string; menuOpen: boolean; }, key: number) => {
                    if (line.id == id) {
                        return {
                            ...line,
                            text: value,
                        }
                    } 
                    return line
                })
            }
        })
    }

    const handleDragOver = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    }

    const handleDrop = (e: any) => {
        e.preventDefault();
        const { id } = e.currentTarget;
        const addWord = e.dataTransfer.getData('addWord');
        
        setLineState(lineState => {
            return {
                ...lineState,
                lines: lineState.lines.map((line: { id: string; text: string; example: string; menuOpen: boolean; }, key: number) => {
                    if (id == line.id) {
                        return {
                            ...line,
                            text: line.text + ' ' + addWord
                        };
                    }
                    return line;
                })
            }
        })

    }

    return (
        <div className={`${fullscreen ? 'px-4 md:px-8 py-4 ' : 'px-3 md:px-4 py-3'} bg-gradient-to-tl from-dark-blue to-med-dark-blue w-full h-full flex flex-col text-dark-blue rounded-lg border-l-4 border-orange-600`} >
            <div className={`${alert ? 'absolute z-100' : 'hidden'}`} style={{top: '', right: '0'}}>
                <PositiveAlert 
                    alert={alert}
                    setAlert={setAlert}
                    header='Are you ready to edit your poem?' 
                    content="Once you go to 'Final Edits' you will not be able to come back to these line prompts" 
                    button1='Go to Final Edits' 
                    button2='Cancel' 
                    svg='question' 
                    handleButton1={handleSubmit} 
                    handleButton2={handleCancel}
                    />
            </div>
            
            <div className="w-full flex flex-row justify-between mb-2">
                <h3 className="w-full flex-grow text-xl text-gray-200 font-open font-light border-b border-white border-opacity-10 mr-2 pb-1 mb-1">
                    Line Prompts
                </h3>
                <IconContext.Provider value={{ color: '#E2E8F0', size: '1.5rem', style: { opacity: `${lineState.lines.length < (lineNo * 2) ? '100%' : '10%'}`}}}>
                    <div className="w-8 cursor-pointer" onClick={handleAddInput}>
                        <FaPlus/>
                    </div>
                </IconContext.Provider>
            </div>
            <div className="w-full h-full overflow-y-auto overflow-x-hidden flex flex-col ml-2">
                {   lineState.lines.length > 1 ? 
                    lineState.lines.map((line: { id: string, text: string, example: string, menuOpen: boolean }, key: number) => {
                        let id = line.id.toString()
                        return (
                        <div key={key} className="relative bg-transparent flex flex-col items-center animate-fadeIn">
                            <div key={key} id={id} className={`${fullscreen ? 'h-12' : 'h-8'} w-full flex flex-row items-center rounded-lg`} onDragOver={handleDragOver} onDrop={handleDrop}>
                                <input id={id} className={`${fullscreen ? 'h-10 px-4 py-2' : 'h-8 text-base px-2 py-1'} w-full rounded-l-lg text-gray-700 bg-gray-300 overflow-x-scroll`} name={id} type="text" value={line.text} onChange={handleInputChange} onDoubleClick={handleMenuToggle}/>
                                <div id={id} className={`${fullscreen ? 'w-10 h-10' : 'w-8 h-8'} bg-gray-300 rounded-r-lg  flex justify-center items-center cursor-pointer`} onClick={handleMenuToggle}>
                                    <div id={id} className="w-4 h-4 border-dark-blue border-b-8 border-r-8 transform rotate-45 mb-1"></div>
                                </div>
                                <div id={id} className={`w-8 h-8 ml-2 flex justify-center items-center ${lineState.lines.length > lineNo ? 'cursor-pointer' : ''}`} onClick={handleDeleteInput}>
                                    <IconContext.Provider value={{color: '#E2E8F0', size: '1.5rem', style: { transform: 'rotate(45deg)', opacity: `${lineState.lines.length > lineNo ? '100%' : '10%'}` }}}>
                                        <FaPlus/>
                                    </IconContext.Provider>
                                </div>
                            </div>
                            <label className={`${line.example ? 'visible' : 'invisible'} ${fullscreen ? 'text-sm mr-12' : 'text-xs'} font-light self-end flex justify-end text-gray-400 mr-12`} htmlFor={id}>
                                ( ex. {line.example} )
                            </label>
                            {   line.menuOpen ?
                                    <div className="absolute left-0 w-9.5/10 shadow-3 h-32 bg-gray-300 rounded-lg p-4 transform translate-y-12 overflow-y-auto overflow-x-hidden z-20">
                                         { 
                                            lineState.prompts.map((prompt: any, key: number) => (
                                                <div key={key} id={id} className={`${fullscreen ? '' : 'text-xs'} w-full mb-2 font-light cursor-pointer`} onClick={handleSelectPrompt}>
                                                    <span id={prompt.id}>{ prompt.prompt }</span>
                                                </div>
                                            ))
                                            
                                        }
                                       
                                    </div>
                                :
                                null
                            }
                        </div>
                    )}) : null
                }
            </div>
            <button className="self-start w-auto px-3 h-8 text-xl font-open font-light bg-yellow-500 text-gray-900 flex justify-center items-center rounded-lg mt-2" onClick={() => setAlert(!alert)}>
                Save and Edit
            </button>
        </div>


    )
}

export default WritingBlock;