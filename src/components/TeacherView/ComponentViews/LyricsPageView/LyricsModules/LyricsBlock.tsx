import React, { useEffect, useContext } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaHighlighter, FaExpand } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
    
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
    fullscreenLyrics: boolean,
    setFullscreenLyrics: React.Dispatch<React.SetStateAction<boolean>>, 
    fullscreen: boolean
}

const LyricsBlock = (props: LyricsBlockProps) => {
    const { color, selected, setSelected, fullscreenLyrics, setFullscreenLyrics, fullscreen } = props;
    const { state, dispatch, theme } = useContext(LessonControlContext);
    const buttons = state.data.lesson.coreLesson.tools
    const rawText = state.data.lesson.coreLesson.content.text;
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

    // const handleDragStart = (e: { target: any; dataTransfer: { setData: (arg0: string, arg1: any) => void; }; }) => {
    //     const target = e.target;

    //     e.dataTransfer.setData('wordId', target.id)
    // }

    // const handleDragOver = (e: { stopPropagation: () => void; }) => {
    //     e.stopPropagation();
    // }


    const handleSelect = () => {
        if (color) {
            let selection = window.getSelection()
            let anchor: { id?: string, [key: string]: any } = selection.anchorNode.parentNode ;
            let focus: { id?: string, [key: string]: any} = selection.focusNode.parentNode ;
            
            let textArr: any[] = [];
            for ( let i = parseInt(anchor.id); i < (parseInt(focus.id) + 1); i++ ) {
                let textObj = {
                    id: i,
                    text: document.getElementById(i.toString()).innerText
                }
                textArr.push(textObj)
            }

            setSelected(selected => {
                return (
                    [
                        ...selected,
                        {
                            id: selected.length + 1,
                            anchor: anchor.id,
                            focus: focus.id,
                            color: color,
                            content: textArr,
                        }
                    ]
                )
            })
        } 

        if (!color) {
            let selection = window.getSelection()
            let anchor: { id?: string, [key: string]: any } = selection.anchorNode.parentNode ;
            let focus: { id?: string, [key: string]: any} = selection.focusNode.parentNode ;

            let selections = selected.filter((selection: { anchor: string, focus: string, color: string }) => {
                return parseInt(selection.anchor) > parseInt(focus.id) ||
                parseInt(selection.focus) < parseInt(anchor.id)
            })

            setSelected(selections)
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

      <div
        className={`md:h-7.2/10 relative ${theme.gradient.cardBase} ${fullscreen ? 'px-6 py-4 text-lg' : 'p-2 text-sm'} ${fullscreenLyrics ? 'md:h-120' : 'h-68'} md:mb-0 w-full flex flex-col justify-between rounded-lg text-gray-400 border-l-4 border-orange-600`}>
        <div className='w-full flex flex-row justify-between mb-1 pb-1'>
          <div className='w-9/10 flex flex-row justify-between border-b border-white border-opacity-10 mr-4 md:mr-0'>
            <h3 className='text-xl font-open font-light mr-4'>Lyrics</h3>
          </div>
          <div className='w-auto'>
            <IconContext.Provider
              value={{
                color: colorPicker(color),
                size: '2rem',
                style: { width: 'auto' },
              }}>
              <FaHighlighter />
            </IconContext.Provider>
          </div>
          {/* <div className="w-auto text-xl" onClick={handleFullscreen}>
              <IconContext.Provider value={{ color: '#E2E8F0', size: '1.5rem' }}>
                  <FaExpand />
              </IconContext.Provider>
          </div> */}
        </div>
        <div
          className='h-9/10 text-gray-200 text-sm overflow-y-auto overflow-x-hidden md:px-4'
          // onPointerUp={handleSelect}
        >
          {displayTextArray.map((array, keyA) => {
            return (
              <div
                id={keyA + 'a'}
                key={keyA}
                className='my-2 text-gray-200 text-sm md:text-base font-light'>
                {array.map((word, keyB) => {
                  acc = acc + 1;
                  let id = acc.toString();
                  return (
                    <span
                      key={keyB}
                      id={id}
                      className={`text-${idCheck(id) ? colorFunc(id) : null} ${
                        idCheck(id) ? `${colorFunc(id)}-tag` : null
                      }`}
                      onPointerUp={handleSelect}
                      // draggable={ color ? 'false' : 'true' }
                      // onDragStart={handleDragStart}
                      // onDragOver={handleDragOver}
                    >
                      {`${word} `}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>


        // <>
        //     <div className={`md:h-8/10 relative bg-dark-blue ${fullscreen ? 'px-6 py-4 text-lg' : 'p-2 text-sm'} ${fullscreenLyrics ? 'md:h-120' : 'h-68'} mb-4 md:mb-0 w-full flex flex-col justify-between rounded-lg shadow-2 text-gray-400 `}>
        //         <div className="w-full flex flex-row justify-between mb-3">
        //             <div className="w-9/10 flex flex-row justify-between border-b border-white mr-4 md:mr-0">
        //                 <h3 className="text-xl font-open font-bold mr-4">
        //                     Lyrics
        //                 </h3>
                       
        //             </div>
        //             <div className="w-auto">
        //                     <IconContext.Provider value={{ color: colorPicker(color), size: '2rem', style: { width: 'auto'}}}>
        //                         <FaHighlighter />
        //                     </IconContext.Provider>
        //             </div>
        //             {/* <div className="w-auto text-xl" onClick={handleFullscreen}>
        //                 <IconContext.Provider value={{ color: '#E2E8F0', size: '1.5rem' }}>
        //                     <FaExpand />
        //                 </IconContext.Provider>
        //             </div> */}
        //         </div>
        //         <div className="h-9/10 text-gray-200 text-sm overflow-y-scroll md:px-4">
        //             {
        //                 displayTextArray.map((array, keyA) => {
        //                     return (
        //                         <div id={keyA + 'a'} key={keyA} className="my-2 text-gray-200 text-sm md:text-base">
        //                             {
        //                                 array.map((word, keyB) => {
        //                                     acc = acc + 1;
        //                                     let id = acc.toString();
        //                                     return (
        //                                         <span 
        //                                             key={keyB}
        //                                             id={id} 
        //                                             onPointerUp={handleSelect}  
        //                                             className={`text-${idCheck(id) ? colorFunc(id) : null} ${idCheck(id) ? `${colorFunc(id)}-tag` : null}`}
        //                                             // draggable={ color ? 'false' : 'true' }
        //                                             // onDragStart={handleDragStart}
        //                                             // onDragOver={handleDragOver}
        //                                         > 
        //                                             {`${word} `}
        //                                         </span>
        //                                     )
        //                                 })
        //                             }
        //                         </div>
        //                     )
        //                 })
        //             }
        //         </div>
        //     </div>
        // </>
    )
}

export default LyricsBlock;