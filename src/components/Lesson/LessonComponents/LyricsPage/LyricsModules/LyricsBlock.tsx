// import { access } from 'fs';
import React, { useState, useEffect, useContext } from 'react';
import { IconContext } from 'react-icons';
import { FaHighlighter, FaExpand } from 'react-icons/fa';
// import { isMainThread } from 'worker_threads';
import { LessonContext } from '../../../../../contexts/LessonContext';

interface LyricsBlockProps {
  color: string;
  selected: any;
  setSelected: React.Dispatch<React.SetStateAction<any[]>>;
  fullscreen: boolean;
  setFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * interfaces
 */

interface SelectedTextGroup {
  [key: string]: {
    color: string;
    selected: string[];
  };
}

export interface FinalText {
  [key: string]: string[];
}

const LyricsBlock = (props: LyricsBlockProps) => {
  const { color, selected, setSelected, fullscreen, setFullscreen } = props;
  const { state, theme, dispatch } = useContext(LessonContext);
  const rawText = state.data.lesson.coreLesson.content.text;
  // const buttons = state.data.lesson.coreLesson.tools;
  // JASPER'S CODE
  const [mouseIsClicked, setMouseIsClicked] = useState<boolean>();
  const [mouseIsHeld, setMouseIsHeld] = useState<boolean>();
  const [selectGroup, setSelectGroup] = useState<number>(0);
  const [initialSelectedText, setIntialSelectedText] = useState<SelectedTextGroup>({});
  const [fullSelectedText, setFullSelectedText] = useState<SelectedTextGroup>({});
  const [finalText, setFinalText] = useState<FinalText>({});
  // const [currentColor, setCurrentColor] = useState<string>('');

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
   */

  /**
   * Function to check if selected textID is already somewhere in the initialSelectedText state
   * @param mappedWordID - string to check for
   */
  const checkIfHighlighted = (mappedWordID: string) => {
    return (
      Object.values(fullSelectedText).filter((group) => group['selected'].includes(mappedWordID))
        .length > 0
    );
  };

  /**
   * Function that returns true | false if select-group for current
   * text selection exists in the state
   * @param groupName - name of select group to check
   */
  const checkIfSelectGroupExists = (groupName: string) => {
    if (typeof initialSelectedText[groupName] === 'undefined') {
      return false;
    } else {
      return true;
    }
  };

  /**
   * Simple get functions to get arrays/values based on 'mappedWordID'
   */
  const getSelectGroupName = (mappedWordID: string) => {
    return Object.keys(initialSelectedText).filter((groupKey) => {
      if (initialSelectedText[groupKey]['selected'].includes(mappedWordID)) {
        return initialSelectedText[groupKey];
      }
    });
  };

  const getArrayWithMappedWord = (mappedWordID: string) => {
    return Object.values(initialSelectedText).filter((group) =>
      group['selected'].includes(mappedWordID)
    );
  };

  const getHighlightColor = (mappedWordID: string) => {
    return Object.values(fullSelectedText).filter((group) => {
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

    if ((mouseIsClicked || mouseIsHeld) && color !== '') {
      console.log('handleSelectText: ', targetWordID);
      if (targetWordID.match(/mappedWord/) !== null) {
        if (color !== 'erase') {
          /**
           * 1. Below a check should be done to see if there is an empty group by the same name
           * 2. If there is, append to it
           */
          if (checkIfSelectGroupExists(`group${selectGroup}`)) {
            setIntialSelectedText({
              ...initialSelectedText,
              [`group${selectGroup}`]: {
                color: color,
                selected: [...initialSelectedText[`group${selectGroup}`]['selected'], targetWordID],
              },
            });
          } else {
            setIntialSelectedText({
              ...initialSelectedText,
              [`group${selectGroup}`]: {
                color: color,
                selected: [targetWordID],
              },
            });
          }
        } else {
          /**
           * 1. else = if color is 'Erase'
           * 2. check array of selected colors for target mappedword
           * 3. remove said mappedword id/whatever from array of selected colors
           * 4. set the selectedText group to that without the text from 'selected', and keep the 'color' as it already is
           */
          if (getArrayWithMappedWord(targetWordID).length > 0) {
            setIntialSelectedText({
              ...initialSelectedText,
              [getSelectGroupName(targetWordID)[0]]: {
                color: initialSelectedText[getSelectGroupName(targetWordID)[0]]['color'],
                selected: eraseMappedWord([
                  ...initialSelectedText[getSelectGroupName(targetWordID)[0]]['selected'],
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
    if (mouseIsHeld || mouseIsClicked) {
      setMouseIsHeld(false);
      setMouseIsClicked(false);
    }

    if (checkIfSelectGroupExists(`group${selectGroup}`)) {
      setSelectGroup(selectGroup + 1);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mouseIsHeld || !mouseIsClicked) {
      setMouseIsHeld(true);
      setMouseIsClicked(true);
    }
    handleSelectText(e);
  };

  /**
   * Lyric/state organization
   */

  const combineLyrics = rawText
    .map((str: string) => [...str.split(' '), '\n'])
    .reduce((acc: string[], val: string[]) => [...acc, ...val]);

  const combineMappedWords = combineLyrics.map(
    (word: string, i: number) => `mappedWord__${i}__${combineLyrics[i]}`
  );

  /**
   * Trim function for array of strings
   * @param strArray - array of strings to be trimmed
   * @param trimReg - regex for which part of the string shoul be trimmed
   */

  const trimWordsInArray = (strArray: string[], trimReg: RegExp) => {
    return strArray.map((word: string, i: number) => {
      return word.replace(trimReg, '');
    });
  };

  /**
   * Function(s) specifically for expanding multiline selection
   * in selectedTextGroup arrays
   */

  /**
   * Find min,max indexes of selectedText
   */
  const minMaxOfArrays = (strArray: string[]) => {
    const parsedNumbers = strArray.map((str: string) => {
      return str.match(/\d+/).sort();
    });
    return [parseInt(parsedNumbers[0][0]), +parsedNumbers[parsedNumbers.length - 1] + 1];
  };

  /**
   * Expand second state to include multiline selected words
   */
  const expandMultilineSelection = () => {
    const groups = Object.keys(initialSelectedText).map((grpName: string, i: number) => {
      const minMax = minMaxOfArrays(initialSelectedText[grpName]['selected']);
      return {
        [`${grpName}`]: {
          color: initialSelectedText[grpName]['color'],
          selected: combineMappedWords.slice(minMax[0], minMax[1]),
        },
      };
    });
    if (Object.keys(initialSelectedText).length > 0) {
      setFullSelectedText(
        groups.reduce((acc, grp) => {
          return { ...acc, ...grp };
        })
      );
    }
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
          [val.color]: [
            [...trimWordsInArray(val.selected, /^mappedWord__([0-9]+)__/)],
            ...acc[val.color],
          ],
        };
      } else {
        return {
          ...acc,
          [val.color]: [[...trimWordsInArray(val.selected, /^mappedWord__([0-9]+)__/)]],
        };
      }
    }, {});
  };

  /**
   * Function to adapt FinalText state word-groups to work with dispatch
   * @param input - Object of color grouped words
   */
  const adaptGroupedWordsForDispatch = (input: string[]) => {
    return trimWordsInArray(input, /^mappedWord__([0-9]+)__/).map((word: any, i: number) => ({
      id: i,
      text: word,
    }));
  };

  const adaptExpandedTextGroupsForDispatch = (input: any) => {
    return Object.keys(input).map((grpName: any, i: number) => {
      const firstGroupNumber = minMaxOfArrays(fullSelectedText[grpName]['selected'])[0];
      const lastGroupNumber = minMaxOfArrays(fullSelectedText[grpName]['selected'])[1];
      const currentText = adaptGroupedWordsForDispatch(fullSelectedText[grpName]['selected']);
      // console.log('adaptExpanded: ', currentText);
      return {
        id: i + 1,
        anchor: firstGroupNumber,
        focus: lastGroupNumber,
        color: fullSelectedText[grpName]['color'],
        content: currentText,
      };
    });
  };

  /**
   * Lifecycle
   * 1. expand multi line text group when initial selected group is updated
   * 2. merge generate color-grouped array
   */

  useEffect(() => {
    expandMultilineSelection();
  }, [initialSelectedText]);

  useEffect(() => {
    if (Object.keys(fullSelectedText).length > 0) {
      setFinalText(groupWordsByColor(Object.values(fullSelectedText)));
    }
  }, [fullSelectedText]);

  /**
   * ANDREW'S DISPATCH
   */
  useEffect(() => {
    setSelected(adaptExpandedTextGroupsForDispatch(fullSelectedText));
  }, [fullSelectedText]);

  /**
   * html functionality
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
   * @param strArray - any string []
   */

  const mapStrToSpan = (strArray: string[]) => {
    return strArray?.map((mappedWord: string, i: number) => {
      if (mappedWord !== '\n') {
        return (
          <span
            key={`mappedWord__${i}__${mappedWord}`}
            className={`p-1 relative
                ${
                  checkIfHighlighted(`mappedWord__${i}__${mappedWord}`)
                    ? `text-${getHighlightColor(`mappedWord__${i}__${mappedWord}`)}`
                    : ''
                }`}>
            &nbsp;{`${mappedWord}`}&nbsp;
            <span
              id={`mappedWord__${i}__${mappedWord}`}
              onMouseOver={handleSelectText}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              className='w-1/2 h-full absolute right-0 transform -translate-x-1/2'></span>
          </span>
        );
      } else {
        return <br />;
      }
    });
  };

  return (
    <>
      <div
        className={`md:h-7.2/10 relative ${theme.gradient.cardBase} ${
          fullscreen ? 'md:h-120' : 'h-68'
        } mt-4 md:mb-0 w-full px-6 py-4 flex flex-col justify-between rounded-lg text-gray-400 text-lg border-l-4 border-orange-600`}>
        <div className='w-full flex flex-row justify-between mb-1 pb-1'>
          <div className='w-9/10 flex flex-row justify-between border-b border-white border-opacity-10 mr-4 md:mr-0'>
            <h3 className='w-auto font-open font-light'>Lyrics</h3>
            <p className='text-gray-600 text-sm text-center'>(drag your mouse over the words!)</p>
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
          className='h-9/10 text-gray-200 text-sm overflow-y-auto overflow-x-hidden p-4'
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
            msUserSelect: 'none',
          }}>
          {mapStrToSpan(combineLyrics)}
        </div>
      </div>
    </>
  );
};

export default LyricsBlock;
