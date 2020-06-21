import React, { useEffect, useContext } from 'react';
import { IconContext } from "react-icons";
import { FaHighlighter, FaExpand } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';

const textParser = (str: string) => {
    let tempWord = '';
    let initialArray = Array.from(str);
    let finalArray = [];
    initialArray.map(letter => {
        if (letter !== ' ') {
            tempWord = tempWord + letter;
        } else {
            finalArray.push(tempWord);
            tempWord = '';
        }
    })
    finalArray.push(tempWord);
    return finalArray;
}

interface LyricsBlockProps {
    color: string,
    selected: any,
    setSelected: React.Dispatch<React.SetStateAction<any[]>>,
    fullscreen: boolean,
    setFullscreen: React.Dispatch<React.SetStateAction<boolean>>,
}

const LyricsBlock = (props: LyricsBlockProps) => {
    const { color, selected, setSelected, fullscreen, setFullscreen } = props;
    const { state, dispatch } = useContext(LessonContext);
    const buttons = state.data.coreLesson.tools
    const rawText = state.data.coreLesson.content.text;
    const displayTextArray: string[][] = [];
    rawText.map((line: string) => {
        let array = (textParser(line));
        displayTextArray.push(array);
    });
    let acc = 0;

    useEffect(() => {
        const sortFunc = (arr: [], sortKey: string) => {
            let array: {}[] = [];
            arr.forEach((item: {color: string, content: string}) => {
                if (sortKey === item.color) {
                    array.push(item.content);
                }
            })
            return array;
        }
    
        let displayProps = {
            name: 'Lyrics Breakdown',
            modules:  buttons.map((button: any, key: string) => {
                return {
                    id: key,
                    name: button.id,
                    label: button.content,
                    color: button.color,
                    description: button.description,
                    content: sortFunc(selected, button.color),
                }
            })
        }
        
        dispatch({
            type: 'SET_DISPLAY_PROPS', 
            payload: {
                name: 'lyrics',
                content: displayProps}
            })

    }, [selected])

    const idCheck = (key: string) => {
        let check = selected.filter((selection: any) => {
           return parseFloat(key) >= selection.anchor && parseFloat(key) <= selection.focus;
        })
        if (check.length > 0) {
            return true;
        }
    }

    const colorFunc = (key: string) => {
        let check = selected.filter((selection: any) => {
            return parseFloat(key) >= selection.anchor && parseFloat(key) <= selection.focus;
        })
        if (check.length > 0) {
            return check[0].color
        }
    }

    const handleDragStart = (e: { target: any; dataTransfer: { setData: (arg0: string, arg1: any) => void; }; }) => {
        const target = e.target;

        e.dataTransfer.setData('wordId', target.id)
    }

    const handleDragOver = (e: { stopPropagation: () => void; }) => {
        e.stopPropagation();
    }

    const handleFullscreen = () => {
        setFullscreen(fullscreen => {
            return !fullscreen
        });
    }

    const handleSelect = () => {
        if (color) {
            let selection = window.getSelection()
            let anchorId = selection.anchorNode.parentNode.id;
            let focusId = selection.focusNode.parentNode.id;
            let textArr: any[] = [];
            for ( let i = parseInt(anchorId); i < (parseInt(focusId) + 1); i++ ) {
                textArr.push(document.getElementById(i.toString()).innerText)
            }

            setSelected(selected => {
                return (
                    [
                        ...selected,
                        {
                            id: selected.length + 1,
                            anchor: anchorId,
                            focus: focusId,
                            color: color,
                            content: textArr,
                        }
                    ]
                )
            })
        }
    }

    const colorPicker = (colorName: string): string => {
        switch (colorName) {
            case 'dark-red':
                return '#CA2222';
            case 'blueberry':
                return '#488AC7';
            case 'sea-green':
                return '#17A589';
            case 'fire-orange':
                return '#FF5733';     
        }
    }

    return (
        <>
            <div className={`relative bg-dark-blue ${fullscreen ? 'h-164' : 'h-68'} w-full pl-8 pr-4 py-4 flex flex-col justify-between rounded shadow-2 text-gray-400 text-lg`}>
                <div className="w-full flex flex-row justify-between">
                    <div className="w-full flex flex-row justify-between border-b border-gray-700 mr-4">
                        <h3 className="text-2xl font-open font-bold mb-2">
                            Lyrics
                        </h3>
                        <div className="mr-2">
                            <IconContext.Provider value={{ color: colorPicker(color), size: '2rem'}}>
                                <FaHighlighter />
                            </IconContext.Provider>
                        </div>
                    </div>
                    <div className="text-xl pt-2" onClick={handleFullscreen}>
                        <IconContext.Provider value={{ color: '#E2E8F0', size: '1.5rem' }}>
                            <FaExpand />
                        </IconContext.Provider>
                    </div>
                </div>
                <div className="text-gray-200 overflow-scroll px-4">
                    {
                        displayTextArray.map((array, keyA) => {
                            return (
                                <div id={keyA + 'a'} key={keyA} className="my-2 text-gray-200 text-base">
                                    {
                                        array.map((word, keyB) => {
                                            acc = acc + 1;
                                            let id = acc.toString();
                                            return (
                                                <span 
                                                    key={keyB}
                                                    id={id} 
                                                    onMouseUp={handleSelect}  
                                                    className={`text-${idCheck(id) ? colorFunc(id) : null} ${idCheck(id) ? `${colorFunc(id)}-tag` : null}`}
                                                    draggable={ color ? 'false' : 'true' }
                                                    onDragStart={handleDragStart}
                                                    onDragOver={handleDragOver}
                                                > 
                                                    {`${word} `}
                                                </span>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default LyricsBlock;