import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { IconContext } from "react-icons";
import { FaPlus } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface WritingBlockProps {
    editMode: {
        open: boolean;
        input: string;
    }
    setEditMode: React.Dispatch<React.SetStateAction<{
        open: boolean;
        input: string;
    }>>
}

const WritingBlock = (props: WritingBlockProps) => {
    const { editMode, setEditMode } = props;
    const [ cookies, setCookie ] = useCookies(['poem']);
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
    const [ lineState, setLineState ] = useState({
        focused: null,
        prompts: promptArray,
        lines: initialLines
        // lines: state.componentState.poem && state.componentState.poem.lines ? state.componentState.poem.lines : initialLines,
    });

    useEffect(() => {
        if ( cookies.poem && cookies.poem.lines.length >= lineNo ) {
            setLineState(prev => {
                return {
                    ...prev,
                    lines: cookies.poem.lines
                }
            })
        }
    }, [])

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

        // if ( state.componentState.poem ) {
        //     dispatch({
        //         type: 'UPDATE_COMPONENT_STATE',
        //         payload: {
        //             componentName: 'poem',
        //             inputName: 'lines',
        //             content: lineState.lines
        //         }
        //     })

        //     dispatch({
        //         type: 'UPDATE_COMPONENT_STATE',
        //         payload: {
        //             componentName: 'poem',
        //             inputName: 'editInput',
        //             content: content
        //         }
        //     })

        //     setCookie('poem', {
        //         ...cookies.poem, 
        //         lines: lineState.lines,
        //         editInput: content
        //     })
        // }
    }, [lineState])

    const closeMenus = () => {
        // setLineState(lineState => {
        //     return {
        //         ...lineState,
        //         lines: lineState.lines.map((line: { text: string }) => {
        //             return {
        //                 ...line,
        //                 menuOpen: false,
        //             }
        //         })
        //     }
        // })
    }

    const handleAddInput = () => {
        let length = lineState.lines.length;
        // if (length < (lineNo * 2)) {
        //     setLineState(lineState => {
        //     return {
        //         ...lineState,
        //         lines: lineState.lines.concat({
        //             id: length,
        //             text: '',
        //             menuOpen: false,
        //             example: '',
        //         })
        //     }
        // })}
    }

    const handleDeleteInput = (e: any) => {
        // let { id } = e.currentTarget;
        // let length = lineState.lines.length;
        // if (length > lineNo) {
        //     setLineState(lineState => {
        //         let newLines = lineState.lines.filter((line: { id: string }, key: number) => {
        //             return id != line.id;
        //         })
        //         return {
        //             ...lineState,
        //             lines: newLines.map((line: { id: string }, key: number) => {
        //                 return {
        //                     ...line,
        //                     id: key
        //                 }
        //             }),
        //         }
        //     })
        // }
    }

    const handleSelectPrompt = (e: { currentTarget: any; }) => {
        const current = e.currentTarget;
        let selectedId = current.querySelector('span').id;
        let selectedPrompt = lineState.prompts.filter((item: { id: number}) => {
            return item.id == selectedId
        }).pop();

        // setLineState(lineState => {
            // return {
            //     ...lineState, 
            //     lines: lineState.lines.map((line: { id: string }, key: number) => {
            //         if (line.id == current.id) {
            //             return {
            //                 ...line, 
            //                 text: selectedPrompt.prompt,
            //                 example: selectedPrompt.example,
            //             }
            //         }
            //         return line
            //     })
            // }
        // });

        closeMenus();
    }

    const handleMenuToggle = (e: any) => {
        // const { id } = e.target;
        // setLineState(lineState => {
        //     return {
        //         ...lineState,
        //         lines: lineState.lines.map((line: { id: string, menuOpen: boolean }, key: number) => {
        //             if (line.id == id) {
        //                 return {
        //                     ...line,
        //                     menuOpen: !line.menuOpen,
        //                 }
        //             }
        //             return {
        //                 ...line, 
        //                 menuOpen: false,
        //             }
        //         })
        //     }
        // })
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
        // const { id, value } = e.target;
        // setLineState(lineState => {
        //     return {
        //         ...lineState,
        //         lines: lineState.lines.map((line: { id: string }, key: number) => {
        //             if (line.id == id) {
        //                 return {
        //                     ...line,
        //                     text: value,
        //                 }
        //             } 
        //             return line
        //         })
        //     }
        // })
    }

    const handleDragOver = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    }

    const handleDrop = (e: any) => {
        e.preventDefault();
        const { id } = e.currentTarget;
        const addWord = e.dataTransfer.getData('addWord');
        
        // setLineState(lineState => {
        //     return {
        //         ...lineState,
        //         lines: lineState.lines.map((line: { id: string, text: string }, key: number) => {
        //             if (id == line.id) {
        //                 return {
        //                     ...line,
        //                     text: line.text + ' ' + addWord
        //                 };
        //             }
        //             return line;
        //         })
        //     }
        // })

    }

    return (
        <div className="bg-dark-blue w-full h-80 md:h-full flex flex-col items-center p-4 md:px-8 md:py-6 rounded-lg shadow-2 mb-4 md:mb-0 " >
            <div className="w-full flex flex-row justify-between mb-4">
                <h3 className="w-full flex-grow text-xl text-gray-200 font-open font-bold border-b border-white mr-2">
                    Line Prompts
                </h3>
                <IconContext.Provider value={{ color: '#E2E8F0', size: '1.5rem', style: { opacity: `${lineState.lines.length < (lineNo * 2) ? '100%' : '10%'}`}}}>
                    <div className="w-8" onClick={handleAddInput}>
                        <FaPlus/>
                    </div>
                </IconContext.Provider>
            </div>
            <div className="w-full h-full overflow-scroll flex flex-col ml-2">
                {   lineState.lines.length > 1 ? 
                    lineState.lines.map((line: { id: string, text: string, example: string, menuOpen: boolean }, key: number) => {
                        let id = line.id.toString()
                        return (
                        <div key={key} className="relative bg-transparent flex flex-col items-center">
                            <div key={key} id={id} className="w-full h-12 flex flex-row items-center rounded-lg" onDragOver={handleDragOver} onDrop={handleDrop}>
                                <input id={id} className="w-full h-10 px-4 py-2 rounded-l-lg text-gray-700 bg-gray-300 shadow-2" name={id} type="text" value={line.text} onChange={handleInputChange} onDoubleClick={handleMenuToggle}/>
                                <div id={id} className="w-10 h-10 bg-gray-300 rounded-r-lg  flex justify-center items-center shadow-2" onClick={handleMenuToggle}>
                                    <div id={id} className="w-4 h-4 border-dark-blue border-b-8 border-r-8 transform rotate-45 mb-1"></div>
                                </div>
                                <div id={id} className="w-8 h-8 ml-2 flex justify-center items-center" onClick={handleDeleteInput}>
                                    <IconContext.Provider value={{color: '#E2E8F0', size: '1.5rem', style: { transform: 'rotate(45deg)', opacity: `${lineState.lines.length > lineNo ? '100%' : '10%'}` }}}>
                                        <FaPlus/>
                                    </IconContext.Provider>
                                </div>
                            </div>
                            <label className={`${line.example ? 'visible' : 'invisible'} self-end flex justify-end text-gray-400 text-sm mr-12`} htmlFor={id}>
                                ( ex. {line.example} )
                            </label>
                            {   line.menuOpen ?
                                    <div className="absolute w-full shadow-3 h-32 bg-gray-300 rounded-lg p-4 transform translate-y-12 overflow-scroll z-20 shadow-2">
                                        { 
                                            lineState.prompts.map((prompt: any, key: string) => (
                                                <div key={key} id={id} className="w-full mb-2" onClick={handleSelectPrompt}>
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
            <button className="self-start w-24 h-8 text-xl font-open font-bold bg-green-500 text-gray-200 shadow-2 rounded-lg mt-2" onClick={handleSubmit}>
                Submit
            </button>
        </div>
    )
}

export default WritingBlock;