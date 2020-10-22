// import { access } from 'fs';
import React, { useState, useEffect, useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaHighlighter, FaExpand } from 'react-icons/fa';
// import { isMainThread } from 'worker_threads';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { SelectedTextGroup, FinalText } from './LyricsActivity';

interface LyricsBlockProps {
  color: string;
  selected: any;
  fullscreen: boolean;
  setSelected: React.Dispatch<React.SetStateAction<any[]>>;
  setFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  firstLastSelected: string[];
  setFirstLastSelected: React.Dispatch<React.SetStateAction<string[]>>;
  initialSelectedText: SelectedTextGroup;
  setInitialSelectedText: React.Dispatch<React.SetStateAction<SelectedTextGroup>>;
  finalText: FinalText;
  setFinalText: React.Dispatch<React.SetStateAction<FinalText>>;
  selectGroup: number;
  setSelectGroup: React.Dispatch<React.SetStateAction<number>>;
}

const LyricsBlock = (props: LyricsBlockProps) => {
  const {
    color,
    selected,
    setSelected,
    fullscreen,
    setFullscreen,
    firstLastSelected,
    setFirstLastSelected,
    initialSelectedText,
    setInitialSelectedText,
    finalText,
    setFinalText,
    selectGroup,
    setSelectGroup,
  } = props;
  const { state, theme, dispatch } = useContext(LessonContext);
  const rawText = state.data.lesson.coreLesson.content.text;
  //  mouse
  const [mouseIsClicked, setMouseIsClicked] = useState<boolean>();
  const [mouseIsHeld, setMouseIsHeld] = useState<boolean>();
  const [mouseTarget, setMouseTarget] = useState<string>('');

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
        return '';
    }
  };

  /**
   * Function to check if selected textID is already somewhere in the initialSelectedText state
   * @param mappedWordID - string to check for
   */
  const checkIfHighlighted = (mappedWordID: string) => {
    const trueOrFalse =
      Object.values(initialSelectedText).filter((group) => group['selected'].includes(mappedWordID))
        .length > 0;
    return trueOrFalse;
  };

  const checkIfHovered = (mappedWordID: string) => {
    const trueOrFalse = mappedWordID === mouseTarget;
    return trueOrFalse;
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
    const filteredGroupName = Object.keys(initialSelectedText).filter((groupKey) => {
      if (initialSelectedText[groupKey]['selected'].includes(mappedWordID)) {
        return groupKey; // returns ['group0']
      }
    });
    if (filteredGroupName.length > 0) return filteredGroupName; // returns ['group0'] -OR- ['group1', 'group2']
  };

  const getArrayWithMappedWord = (mappedWordID: string) => {
    return Object.values(initialSelectedText).filter((group) =>
      group['selected'].includes(mappedWordID)
    );
  };

  const getHighlightColor = (mappedWordID: string) => {
    const groupWithMappedWord = Object.values(initialSelectedText).filter((group) => {
      if (group['selected'].includes(mappedWordID)) {
        return group['color'];
      }
    });

    if (typeof groupWithMappedWord[0] !== 'undefined') {
      return groupWithMappedWord[0]['color'];
    }
  };

  const eraseSelectGroup = (selectGroupName: string[]) => {
    // here you pass in ['group0'] -OR- ['group1', 'group2']
    const remainingGroups = Object.keys(initialSelectedText).filter(
      (obj: any) => selectGroupName.includes(obj) === false
    ); // group0, group1,... array
    return remainingGroups.reduce((acc: any, groupName: string) => {
      return { ...acc, ...{ [groupName]: initialSelectedText[groupName] } };
    }, {});
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
   */

  const handleSelectGroupIncrement = () => {
    if (color !== 'erase') {
      console.log(
        'handle increment: ',
        initialSelectedText[`group${selectGroup}`]['selected'].length
      );
    }
  };

  const handleDragSelectText = () => {
    if (color !== '') {
      if (color !== 'erase') {
        /**
         * 1. Below a check should be done to see if there is an empty group by the same name
         * 2. If there is, append to it
         */
        const [minWordID, maxWordID] = minMaxOfArrays(firstLastSelected);
        const currentSelectedWords = combineMappedWords.slice(minWordID, maxWordID);

        setInitialSelectedText({
          ...initialSelectedText,
          [`group${selectGroup}`]: {
            color: color,
            selected: currentSelectedWords,
          },
        });
      } else {
        if (getArrayWithMappedWord(firstLastSelected[0]).length > 0) {
          const groupNameToErase = getSelectGroupName(firstLastSelected[0]);
          const groupAfterErase = eraseSelectGroup(groupNameToErase);
          setInitialSelectedText(groupAfterErase);
        }
      }
    }
  };

  const handleClickSelectText = (e: React.MouseEvent) => {
    const t = e.currentTarget as HTMLElement;
    const targetWordID = t.id || '';

    if (typeof targetWordID !== 'undefined') {
      if (color !== 'erase') {
        if (targetWordID.includes('mapped')) {
          setInitialSelectedText({
            ...initialSelectedText,
            [`group${selectGroup}`]: {
              color: color,
              selected: [targetWordID],
            },
          });
        }
      } else {
        if (targetWordID.includes('mapped')) {
          //
          //
          //
          //
        }
      }
    }
  };

  /**
   * Mouse/grouping functionality
   */
  const handleMouseUp = (e: React.MouseEvent) => {
    setMouseTarget(''); // Clear mouse target

    if (mouseIsHeld || mouseIsClicked) {
      setFirstLastSelected([]); // Reset first last selected if mouse is clicked
      setMouseIsHeld(false);
      setMouseIsClicked(false);
    }

    if (color !== 'erase') {
      setSelectGroup(selectGroup + 1);
    }
  };

  const handleMouseLeave = () => {
    setMouseTarget('');

    if (mouseIsHeld || mouseIsClicked) {
      setFirstLastSelected([]); // Reset first last selected if mouse is clicked
      setMouseIsHeld(false);
      setMouseIsClicked(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mouseIsHeld || !mouseIsClicked) {
      setMouseIsHeld(true);
      setMouseIsClicked(true);
    }
  };

  const handleMouseOver = (e: React.MouseEvent) => {
    const t = e.currentTarget as HTMLElement;
    const targetWordID = t.id || '';

    //  Updates mouse target state
    setMouseTarget(targetWordID);

    /**
     * EXPERIMENTAL NEW SELECTION PART
     */
    if (mouseIsHeld || mouseIsClicked) {
      if (firstLastSelected.length === 0) {
        setFirstLastSelected([targetWordID]);
      } else if (firstLastSelected.length >= 1) {
        setFirstLastSelected([firstLastSelected[0], targetWordID]);
      }
    }
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
    const parsedNumbers = strArray
      .map((str: string) => {
        return str.match(/\d+/);
      })
      .map((arr: string[]) => parseInt(arr[0]))
      .sort();

    return [parsedNumbers[0], +parsedNumbers[parsedNumbers.length - 1] + 1];
  };

  /**
   * Function to adapt FinalText state word-groups to work with dispatch
   * @param input - Object of color grouped words
   */
  const adaptWordGroupsForDispatch = (input: string[]) => {
    return trimWordsInArray(input, /^mappedWord__([0-9]+)__/).map((word: any, i: number) => ({
      id: i,
      text: word,
    }));
  };

  const adaptTextGroupsForDispatch = (input: any) => {
    return Object.keys(input).map((grpName: any, i: number) => {
      const firstGroupNumber = minMaxOfArrays(initialSelectedText[grpName]['selected'])[0];
      const lastGroupNumber = minMaxOfArrays(initialSelectedText[grpName]['selected'])[1];
      const currentText = adaptWordGroupsForDispatch(initialSelectedText[grpName]['selected']);

      return {
        id: i + 1,
        anchor: firstGroupNumber,
        focus: lastGroupNumber,
        color: initialSelectedText[grpName]['color'],
        content: currentText,
      };
    });
  };

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
            id={`mappedWord__${i}__${mappedWord}`}
            onMouseOver={handleMouseOver}
            className={`relative py-2
                ${
                  //  Check if current mapped word is highlighted
                  //  or
                  //  if the word is the current target
                  checkIfHighlighted(`mappedWord__${i}__${mappedWord}`)
                    ? `text-${getHighlightColor(`mappedWord__${i}__${mappedWord}`)} bg-dark`
                    : ''
                }
                ${checkIfHovered(`mappedWord__${i}__${mappedWord}`) ? `border border-neg1` : ''}
                `}>
            &nbsp;{`${mappedWord}`}&nbsp;
            <span
              id={`mappedWord__${i}__${mappedWord}`}
              onMouseOver={handleMouseOver}
              onClick={handleClickSelectText}
              className='w-1/2 h-8 absolute right-0 transform -translate-x-1/2'></span>
          </span>
        );
      } else {
        return <br />;
      }
    });
  };

  /**
   * Lifecycle
   * 1. expand multi line text group when initial selected group is updated
   * 2. merge generate color-grouped array
   */

  useEffect(() => {
    handleDragSelectText();
  }, [firstLastSelected]);

  /**
   * ANDREW'S DISPATCH
   */
  useEffect(() => {
    //  EMPTY GROUP CLEANUP ***temporary***
    // const nonEmptySelectGroupKeys = Object.keys(initialSelectedText).filter(
    //   (objKey) => initialSelectedText[objKey]['selected'].length > 0
    // );
    // const nonEmptySelectGroups = nonEmptySelectGroupKeys.reduce((acc: any, groupName: string) => {
    //   return { ...acc, ...{ [groupName]: initialSelectedText[groupName] } };
    // }, {});
    //  EMPTY GROUP CLEANUP ***temporary***
    setSelected(adaptTextGroupsForDispatch(initialSelectedText));
  }, [initialSelectedText]);

  return (
    <>
      <div className={`relative w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>
        <h3 className='w-auto'>Lyrics</h3>
        <p className='w-auto text-gray-600 text-sm text-center'>
          (click and drag your mouse over the words!)
        </p>
        <div className='absolute w-auto right-0 top-0'>
          <IconContext.Provider
            value={{
              color: `${colorPicker(color) === '' ? 'white' : colorPicker(color)}`,
              size: '2rem',
              style: { width: 'auto' },
            }}>
            <FaHighlighter />
          </IconContext.Provider>
        </div>
      </div>
      <div
        className={`h-192 leading-8  text-sm overflow-y-scroll overflow-x-hidden px-1/10 rounded-xl bg-darker-gray text-gray-200`}
        onMouseDown={handleMouseDown}
        onClick={handleClickSelectText}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          MozUserSelect: 'none',
          WebkitUserSelect: 'none',
          msUserSelect: 'none',
        }}>
        {mapStrToSpan(combineLyrics)}
      </div>
    </>
  );
};

export default LyricsBlock;
