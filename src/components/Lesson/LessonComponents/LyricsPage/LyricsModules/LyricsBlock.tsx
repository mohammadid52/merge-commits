import React, { useState, useEffect, useContext } from 'react';
import { IconContext } from 'react-icons';
import { FaHighlighter, FaExpand } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';

const textParser = (str: string) => {
  let tempWord = '';
  let initialArray = Array.from(str);
  let finalArray = [];
  initialArray.map((letter) => {
    if (letter !== ' ') {
      tempWord = tempWord + letter;
    } else {
      finalArray.push(tempWord);
      tempWord = '';
    }
  });
  finalArray.push(tempWord);
  return finalArray;
};

interface LyricsBlockProps {
  color: string;
  selected: any;
  setSelected: React.Dispatch<React.SetStateAction<any[]>>;
  fullscreen: boolean;
  setFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
 * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
 * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
 * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
 * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
 * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
 * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
 */

/**
 * components & utils
 */

// import ColorPicker from './components/ColorPicker/ColorPicker';
const wordRegex = /([\w\(\)'’"“”-]+)/g;
// import DisplaySelected from './components/DisplaySelected/DisplaySelected';

/**
 * enums & interfaces
 */

enum HighlightColor {
  Green = 'green',
  Orange = 'orange',
  Red = 'red',
  Erase = 'erase',
}

interface SelectedTextGroup {
  [key: string]: {
    color: string;
    selected: string[];
  };
}

export interface FinalText {
  [key: string]: string[];
}

/**
 * Object path to lyrics:
 * state.data.lesson.coreLesson.content.text[]
 */

/**
 * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
 * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
 * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
 * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
 * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
 * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
 * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
 */

const LyricsBlock = (props: LyricsBlockProps) => {
  const { color, selected, setSelected, fullscreen, setFullscreen } = props;
  const { state, theme, dispatch } = useContext(LessonContext);
  const buttons = state.data.lesson.coreLesson.tools;
  const rawText = state.data.lesson.coreLesson.content.text;
  const displayTextArray: string[][] = [];
  rawText.map((line: string) => {
    let array = textParser(line);
    displayTextArray.push(array);
  });
  let acc = 0;

  useEffect(() => {
    const sortFunc = (arr: [], sortKey: string) => {
      let array: {}[] = [];
      arr.forEach((item: { color: string; content: string }) => {
        if (sortKey === item.color) {
          array.push(item.content);
        }
      });
      return array;
    };

    let displayProps = {
      name: 'Lyrics Breakdown',
      modules: buttons.map((button: any, key: string) => {
        return {
          id: key,
          name: button.id,
          label: button.content,
          color: button.color,
          description: button.description,
          content: sortFunc(selected, button.color),
        };
      }),
    };

    dispatch({
      type: 'SET_DISPLAY_PROPS',
      payload: {
        name: 'lyrics',
        content: displayProps,
      },
    });
  }, [selected]);

  const idCheck = (key: string) => {
    let check = selected.filter((selection: any) => {
      return parseFloat(key) >= selection.anchor && parseFloat(key) <= selection.focus;
    });
    if (check.length > 0) {
      return true;
    }
  };

  const colorFunc = (key: string) => {
    let check = selected.filter((selection: any) => {
      return parseFloat(key) >= selection.anchor && parseFloat(key) <= selection.focus;
    });
    if (check.length > 0) {
      return check[0].color;
    }
  };

  const handleFullscreen = () => {
    setFullscreen((fullscreen) => {
      return !fullscreen;
    });
  };

  const handleSelect = () => {
    if (color) {
      let selection = window.getSelection();
      let anchor: { id?: string; [key: string]: any } = selection.anchorNode.parentNode;
      let focus: { id?: string; [key: string]: any } = selection.focusNode.parentNode;

      let textArr: any[] = [];
      for (let i = parseInt(anchor.id); i < parseInt(focus.id) + 1; i++) {
        let textObj = {
          id: i,
          text: document.getElementById(i.toString()).innerText,
        };
        textArr.push(textObj);
      }

      setSelected((selected) => {
        return [
          ...selected,
          {
            id: selected.length + 1,
            anchor: anchor.id,
            focus: focus.id,
            color: color,
            content: textArr,
          },
        ];
      });
    }

    if (!color) {
      let selection = window.getSelection();
      let anchor: { id?: string; [key: string]: any } = selection.anchorNode.parentNode;
      let focus: { id?: string; [key: string]: any } = selection.focusNode.parentNode;

      let selections = selected.filter(
        (selection: { anchor: string; focus: string; color: string }) => {
          return (
            parseInt(selection.anchor) > parseInt(focus.id) ||
            parseInt(selection.focus) < parseInt(anchor.id)
          );
        }
      );

      setSelected(selections);
    }
  };

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
      case 'erase':
        return 'erase';
    }
  };

  /**
   * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
   * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
   * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
   * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
   * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
   * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
   * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
   */

  const [mouseIsClicked, setMouseIsClicked] = useState<boolean>();
  const [currentColor, setCurrentColor] = useState<string>('');
  const [selectGroup, setSelectGroup] = useState<number>(0);
  const [selectedTextGroups, setSelectedTextGroups] = useState<SelectedTextGroup>({});
  const [finalText, setFinalText] = useState<FinalText>({});

  /**
   * Function to check if selected textID is already somewhere in the selectedTextGroups state
   * @param mappedWordID - string to check for
   */
  const checkIfHighlighted = (mappedWordID: string) => {
    return (
      Object.values(selectedTextGroups).filter((group) => group['selected'].includes(mappedWordID))
        .length > 0
    );
  };

  /**
   * Function that returns true | false if select-group for current
   * text selection exists in the state
   * @param groupName - name of select group to check
   */
  const checkIfSelectGroupExists = (groupName: string) => {
    if (typeof selectedTextGroups[groupName] === 'undefined') {
      return false;
    } else {
      return true;
    }
  };

  /**
   * Simple get functions to get arrays/values based on 'mappedWordID'
   */
  const getSelectGroupName = (mappedWordID: string) => {
    return Object.keys(selectedTextGroups).filter((groupKey) => {
      if (selectedTextGroups[groupKey]['selected'].includes(mappedWordID)) {
        return selectedTextGroups[groupKey];
      }
    });
  };

  const getArrayWithMappedWord = (mappedWordID: string) => {
    return Object.values(selectedTextGroups).filter((group) =>
      group['selected'].includes(mappedWordID)
    );
  };

  const getHighlightColor = (mappedWordID: string) => {
    return Object.values(selectedTextGroups).filter((group) => {
      if (group['selected'].includes(mappedWordID)) {
        return group['color'];
      }
    })[0]['color'];
  };

  const eraseMappedWord = (filterAbleArray: string[]) => (mappedWordID: string) => {
    return filterAbleArray.filter((word) => word !== mappedWordID);
  };

  /**
   * Function that handles the text selection
   * 1. drag mouse over text
   * 2. if text is tagged, do nothing
   * 3. if text is NOT tagged, process with functions above
   *
   * 4. if passing tests above...
   * 5. add text to state
   * 6. mark html with color tag
   *
   * @param e - Drag event over target text
   */
  const handleSelectText = (e: React.MouseEvent) => {
    const t = e.currentTarget as HTMLElement;
    const targetWordID = t.id || '';

    e.preventDefault();

    if (mouseIsClicked && color !== '') {
      if (targetWordID.match(/mappedWord/) !== null) {
        if (color !== 'erase') {
          /**
           * 1. Below a check should be done to see if there is an empty group by the same name
           * 2. If there is, append to it
           */
          if (checkIfSelectGroupExists(`group${selectGroup}`)) {
            setSelectedTextGroups({
              ...selectedTextGroups,
              [`group${selectGroup}`]: {
                color: color,
                selected: [...selectedTextGroups[`group${selectGroup}`]['selected'], targetWordID],
              },
            });
          } else {
            setSelectedTextGroups({
              ...selectedTextGroups,
              [`group${selectGroup}`]: {
                color: color,
                selected: [targetWordID],
              },
            });

            console.log('handleSelectText(): ', selectedTextGroups);
          }
        } else {
          /**
           * 1. else = if color is 'Erase'
           * 2. check array of selected colors for target mappedword
           * 3. remove said mappedword id/whatever from array of selected colors
           * 4. set the selectedText group to that without the text from 'selected', and keep the 'color' as it already is
           */
          if (getArrayWithMappedWord(targetWordID).length > 0) {
            setSelectedTextGroups({
              ...selectedTextGroups,
              [getSelectGroupName(targetWordID)[0]]: {
                color: selectedTextGroups[getSelectGroupName(targetWordID)[0]]['color'],
                selected: eraseMappedWord([
                  ...selectedTextGroups[getSelectGroupName(targetWordID)[0]]['selected'],
                ])(targetWordID),
              },
            });
          }
        }
      }
    }
  };

  /**
   * Mouse functionality
   */

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseIsClicked) {
      setMouseIsClicked(false);
    }

    if (checkIfSelectGroupExists(`group${selectGroup}`)) {
      setSelectGroup(selectGroup + 1);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mouseIsClicked) {
      setMouseIsClicked(true);
    }
  };

  /**
   * Color functionality
   */

  const handleColorChange = (e: React.MouseEvent<HTMLElement>) => {
    const t = e.target as HTMLElement;
    if (currentColor !== t.id) {
      if (t.id === 'orange') {
        setCurrentColor('dark-red');
      }
      if (t.id === 'green') {
        setCurrentColor('blueberry');
      }
      if (t.id === 'red') {
        setCurrentColor('sea-green');
      }
      if (t.id === 'erase') {
        setCurrentColor('fire-orange');
      }
    }
  };

  /**
   * String / html functionality
   */

  const combineLyrics = rawText.reduce((acc: string, val: string) => acc + ' ' + val);

  /**
   * 
   * get words id'd like this = word_1 ... word_100
   * spread the selected array to [...wordarray[1],...wordarray[100]]
   */

  /**
   * Function that maps an input string to something selectable
   * 1. check if string contains spaces
   * 2. separate string into array of spaces and words/charactes
   * 3. map over array of words/characters
   * 4. replace words with <span></span>
   *
   * Punctuation: [,.-:;]
   *
   * @param str - any string constant/variable
   */

  const mapStrToSpan = (str: string, iTop: number) => {
    return str
      .replace(wordRegex, '@*@$1@*@')
      .split('@*@')
      ?.map((mappedWord: string, i: number) => {
        if (mappedWord?.match(wordRegex) !== null) {
          return (
            <span
              key={`mappedWord${i}${iTop}__${mappedWord}`}
              id={`mappedWord${i}${iTop}__${mappedWord}`}
              onMouseOver={handleSelectText}
              onMouseUp={handleMouseUp}
              className={`additionalClass 
                ${
                  checkIfHighlighted(`mappedWord${i}${iTop}__${mappedWord}`)
                    ? `text-${getHighlightColor(`mappedWord${i}${iTop}__${mappedWord}`)}`
                    : ''
                }`}>{`${mappedWord}`}</span>
          );
        } else {
          return mappedWord;
        }
      });
  };

  const mapStrArrayToHtml = (strArray: string[]) => {
    return strArray.map((str: string, i: 1) => (
      <>
        {mapStrToSpan(str, i)}
        <br />
      </>
    ));
  };

  /**
   * Trim function for array of strings
   * @param strArray - array of strings to be trimmed
   * @param trimReg - regex for which part of the string shoul be trimmed
   */

  const trimWords = (strArray: string[], trimReg: RegExp) => {
    return strArray.map((word: string, i: number) => {
      return word.replace(trimReg, '');
    });
  };

  /**
   * Group final words together and trim strings
   * @param input - Array of objects with [key: string]:string[]
   */
  const groupWordsByColor = (input: any) => {
    return input.reduce((acc: any, val: any) => {
      if (Object.keys(acc).includes(val.color)) {
        return {
          ...acc,
          [val.color]: [[...trimWords(val.selected, /^mappedWord([0-9]+)__/)], ...acc[val.color]],
        };
      } else {
        return { ...acc, [val.color]: [[...trimWords(val.selected, /^mappedWord([0-9]+)__/)]] };
      }
    }, {});
  };

  /**
   * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
   * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
   * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
   * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
   * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
   * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
   * JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE JASPER'S CODE
   */

  /**
   * Lifecycle
   */

  useEffect(() => {
    console.log('first step: ', combineLyrics);
  });

  return (
    <>
      <div
        className={`md:h-7.2/10 relative ${theme.gradient.cardBase} ${
          fullscreen ? 'md:h-120' : 'h-68'
        } mt-4 md:mb-0 w-full px-6 py-4 flex flex-col justify-between rounded-lg text-gray-400 text-lg border-l-4 border-orange-600`}>
        <div className='w-full flex flex-row justify-between mb-3'>
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
        </div>
        <div
          className='h-9/10 text-gray-200 text-sm overflow-y-auto overflow-x-hidden md:px-4'
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          style={{
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
            msUserSelect: 'none',
          }}>
          {mapStrArrayToHtml(rawText)}
        </div>
      </div>
    </>
  );
};

export default LyricsBlock;
