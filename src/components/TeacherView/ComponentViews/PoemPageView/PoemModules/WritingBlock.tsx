import React, { useState, useEffect, useContext } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { AiOutlineArrowDown, AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import ToolTip from '../../../../General/ToolTip/ToolTip';
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
    const { state, theme, dispatch } = useContext(LessonControlContext);
    const lineNo = state.data.lesson.activity.lineNumber;
    const promptArray = state.data.lesson.activity.writingPrompts;
    const initialLines = [];
    for (let i = 0; i < lineNo; i++) {
        let tempObj = {
            id: `${i}`,
            text: '',
            example: '',
            menuOpen: false,
        }
        initialLines.push(tempObj)
    }
    const [lineState, setLineState] = useState<lineState>({
        focused: null,
        prompts: promptArray,
        lines: initialLines,
    });

    const [alert, setAlert] = useState(false);

    const handleCancel = () => {
        setAlert(!alert);
    }

    useEffect(() => {
        if (displayStudentData && state.studentViewing.studentInfo.activityData) {
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
            })
        }
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
        <div className='w-full flex flex-col'>
            <div
                className={`${alert ? 'absolute z-100' : 'hidden'}`}
                style={{ top: '50%' }}>
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
            <div className={`w-full h-full rounded-xl`}>
                <h3 className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>
                    Line Prompts{' '}
                    <ToolTip
                        width='w-40'
                        position='bottom'
                        header='Instructions'
                        content='Make sure you are finished with the line prompts before you click "Save and Edit"'
                    />
                </h3>


                {/* ADD LINE PROMPS BUTTON */}

                <button
                    className={`mx-auto w-auto px-3 h-8 bg-sea-green text-gray-900 flex justify-center items-center rounded-xl mt-2 ${theme.elem.text}`}
                    onClick={handleAddInput}>

                    Add Line

                    <IconContext.Provider
                        value={{
                            size: '1.5rem',
                            style: { width: '32px' },
                            className: `text-white`,
                        }}>
                        <div className='w-8 cursor-pointer'>
                            <AiOutlinePlus />
                        </div>
                    </IconContext.Provider>

                </button>




            </div>
            <div className='w-full flex flex-col p-4 border-2 border-white border-opacity-20 rounded-lg'>

                {/* MAP THE LINE PROMPTS */}
                {lineState.lines.length > 1
                    ? lineState.lines.map(
                        (
                            line: { id: string; text: string; example: string; menuOpen: boolean },
                            key: number
                        ) => {
                            let id = line.id.toString();
                            return (
                                <div key={key} className='relative flex flex-col'>
                                    <div className='relative'>
                                        <div
                                            key={key}
                                            id={id}
                                            className='relative w-full h-12 flex flex-row items-center rounded-xl'
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}>
                                            <input
                                                id={id}
                                                className={`rounded-l-xl ${theme.elem.textInput}`}
                                                name={id}
                                                type='text'
                                                value={line.text}
                                                onChange={handleInputChange}
                                                onDoubleClick={handleMenuToggle}
                                            />


                                            {/* MENU TOGGLE BUTTON */}
                                            <div
                                                id={id}
                                                className='w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-r-xl flex justify-center items-center cursor-pointer'
                                                onClick={handleMenuToggle}>
                                                <IconContext.Provider
                                                    value={{
                                                        size: '1.5rem',
                                                        style: { width: '32px', pointerEvents: 'none' },
                                                        className: `text-white`,
                                                    }}>
                                                    <div id={id} className='w-8 cursor-pointer'>
                                                        <AiOutlineArrowDown />
                                                    </div>
                                                </IconContext.Provider>
                                            </div>


                                            {/* REMOVE LINE PROMPT */}
                                            <div
                                                id={id}
                                                className={`w-10 h-10 ml-2 flex justify-center items-center ${lineState.lines.length > lineNo ? 'cursor-pointer' : ''
                                                    }`}
                                                onClick={handleDeleteInput}>
                                                <IconContext.Provider
                                                    value={{
                                                        size: '1.5rem',
                                                        style: {
                                                            width: '32px',
                                                            opacity: `${lineState.lines.length > lineNo ? '100%' : '50%'}`,
                                                        },
                                                        className: `text-white`,
                                                    }}>
                                                    <AiOutlineClose />
                                                </IconContext.Provider>
                                            </div>
                                        </div>

                                        <label
                                            className={`${line.example ? 'visible' : 'invisible'
                                                } font-light self-end flex justify-start text-gray-400 text-sm mr-12`}
                                            htmlFor={id}>
                                            ( ex. {line.example} )
                          </label>
                                        {line.menuOpen ? (
                                            <div className={`absolute left-0 top-3 w-full rounded-b-xl z-50 ${theme.elem.textInput}`}>
                                                {
                                                    lineState.prompts.map((prompt: any, key: number) => (
                                                        <div
                                                            key={key}
                                                            id={id}
                                                            className='w-full mb-2 font-light cursor-pointer'
                                                            onClick={handleSelectPrompt}>
                                                            <span id={prompt.id}>{prompt.prompt}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        }
                    )
                    : null}
            </div>
            <button
                className={`self-center w-auto px-3 h-8 bg-yellow-500 text-gray-900 flex justify-center items-center rounded-xl mt-2 ${theme.elem.text}`}
                onClick={() => setAlert(!alert)}>
                Save and Edit
          </button>
        </div>
    );
}

export default WritingBlock;