// import { access } from 'fs';
import React, { useState, useEffect, useContext, ReactNode } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaHighlighter, FaExpand } from 'react-icons/fa';
// import { isMainThread } from 'worker_threads';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { SelectedTextGroup, FinalText } from './LyricsActivity';

interface LyricsBlockProps {
  color: string;
  colorPicker: (color:string) => string;
  selected: any;
  fullscreen: boolean;
  setSelected: React.Dispatch<React.SetStateAction<any[]>>;
  setFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  // firstLastSelected: string[];
  // setFirstLastSelected: React.Dispatch<React.SetStateAction<string[]>>;
  initialSelectedText: SelectedTextGroup;
  setInitialSelectedText: React.Dispatch<React.SetStateAction<SelectedTextGroup>>;
  finalText: FinalText;
  setFinalText: React.Dispatch<React.SetStateAction<FinalText>>;
  selectGroup: number;
  setSelectGroup: React.Dispatch<React.SetStateAction<number>>;
  children?: ReactNode;
}

const LyricsBlock = (props: LyricsBlockProps) => {
  const {
    color,
    colorPicker,
    selected,
    setSelected,
    fullscreen,
    setFullscreen,
    initialSelectedText,
    setInitialSelectedText,
    selectGroup,
    setSelectGroup,
    finalText,
    setFinalText,
    children
  } = props;
  const { state, theme, dispatch } = useContext(LessonContext);
  const rawText = state.data.lesson.coreLesson.content.text;
  // text selection
  const [firstLastSelected, setFirstLastSelected] = useState<string[]>(['', '']);

  //  mouse
  const [mouseTarget, setMouseTarget] = useState<string>('');

  /* const colorPicker = (colorName: string): string => {
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
  }; */

  /**
   * Function to check if selected textID is already somewhere in the initialSelectedText state
   * @param mappedWordID - string to check for
   */
  const checkIfHighlighted = (mappedWordID: string) => {
    // trueOrFalse checks if initialSelectedText object contains the mapped word
    // ...or the current firstLastSelected array (during selection) contains it
    const trueOrFalse =
      Object.values(initialSelectedText).filter((group) => group['selected'].includes(mappedWordID))
        .length > 0 || firstLastSelected.includes(mappedWordID);
    return trueOrFalse;
  };

  const checkIfHovered = (mappedWordID: string) => {
    const trueOrFalse = mappedWordID === mouseTarget;
    return trueOrFalse;
  };

  /**
   * Simple get functions to get arrays/values based on 'mappedWordID'
   */
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

  /**
   * Function that erases a selected group of text based on input group name
   * @param selectGroupName - name of group which comes out of 'getSelectGroupName'
   */

  const eraseSelectGroup = (selectGroupName: string[]) => {
    // here you pass in ['group0'] -OR- ['group1', 'group2']
    const remainingGroups = Object.keys(initialSelectedText).filter(
      (obj: any) => selectGroupName.includes(obj) === false
    ); // group0, group1,... array
    return remainingGroups.reduce((acc: any, groupName: string) => {
      return { ...acc, ...{ [groupName]: initialSelectedText[groupName] } };
    }, {});
  };

  const getFullSelection = () => {
    const [minWordID, maxWordID] = minMaxOfArrays(firstLastSelected);
    const currentSelectedWords = combineMappedWords.slice(minWordID, maxWordID);

    setInitialSelectedText({
      ...initialSelectedText,
      [`group${selectGroup}`]: {
        color: color,
        selected: currentSelectedWords,
      },
    });
  };

  /**
   * Function that handles text selection based on click
   * - 1st click = add target word to firstLastSelected[0]
   * - 2nd click = add target word to firstLastSelected[1]
   *
   * Result:
   * - If 1st & 2nd are the same target, then only 1 word will be added
   * to the final selected word group
   *
   * - If 1st & 2nd are different, add all words bbetween to selected
   * word group.
   *
   * @param e - Mouse click event
   */

  const handleClickSelectText = (targetWordID: string) => {
    const firstWord = firstLastSelected[0];
    const lastWord = firstLastSelected[1];

    if (targetWordID.match(/mapped/) !== null) {
      if (firstWord === '') {
        setFirstLastSelected([targetWordID, '']);
      } else if (firstWord !== '') {
        setFirstLastSelected([firstWord, targetWordID]);
      }
    }
  };

  const handleEraseText = (targetWordID: string) => {
    const textIsInGroup = getArrayWithMappedWord(targetWordID).length > 0;
    if (textIsInGroup) {
      const groupToErase = getSelectGroupName(targetWordID);
      const groupAfterErase = eraseSelectGroup(groupToErase);
      setInitialSelectedText(groupAfterErase);
    }
  };

  const handleSelection = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    const targetWordID = t.id || '';

    if (color !== 'erase' && color !== '') {
      handleClickSelectText(targetWordID);
    } else if (color === 'erase') {
      handleEraseText(targetWordID);
    }
  };

  /**
   * Lyric/state organization
   * - Combinelyrics adds a linebreak character \n to the string where there are spaces
   * - Makes it easier to parse on the breakdown page
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
   * Find min,max indexes of selectedText
   */
  const minMaxOfArrays = (strArray: string[]) => {
    const parsedNumbers = strArray
      .map((str: string) => str.match(/\d+/))
      .map((arr: string[]) =>  parseInt(arr[0])
      )
      .sort((a,b)=>a-b);



    return (parsedNumbers.length > 1)
    ? [parsedNumbers[0], +parsedNumbers[1]+1]
    : [...parsedNumbers]
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
            className={`relative py-2 w-full
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
          </span>
        );
      } else {
        return <br key={`key${i}`} />;
      }
    });
  };

  /**
   * Lifecycle
   * 1. expand multi line text group when initial selected group is updated
   * 2. merge generate color-grouped array
   */

  useEffect(() => {
    const firstWord = firstLastSelected[0];
    const lastWord = firstLastSelected[1];

    if (lastWord !== '') {
      getFullSelection();
      setFirstLastSelected(['', '']);
      setSelectGroup(selectGroup + 1);
    }
  }, [firstLastSelected]);

  /**
   * ANDREW'S DISPATCH
   */
  useEffect(() => {
    setSelected(adaptTextGroupsForDispatch(initialSelectedText));
  }, [initialSelectedText]);

  return (
    <>
      {/* <div className={`relative w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>
        <h3 className='w-auto'>Lyrics</h3>

        <div className='absolute w-auto right-0 top-0'>
          <IconContext.Provider
            value={{
              color: `${props.colorPicker(color) === '' ? 'white' : props.colorPicker(color)}`,
              size: '2rem',
              style: { width: 'auto' },
            }}>
            <FaHighlighter />
          </IconContext.Provider>
        </div>
        </div> */}

        {/* JUST A HARMLESS DIV WITH INSTRUCTIONS */}
        {/* @ANDREW -- TO BE REVISED */}
        {/* <div className='w-full flex flex-row justify-between mb-1 pb-1'>
          <div className='w-full flex flex-col justify-between border-b border-white border-opacity-10 mr-4 md:mr-0'>
            <p className='text-gray-600 text-sm text-left'>
              - Double click a word to select <b>one</b> word
            </p>
            <p className='text-gray-600 text-sm text-left'>
              - To select a sentence/phrase, click the <b>'first word'</b> and the <b>'last word'</b> of the sentence
            </p>
          </div>
        </div> */}

          <div
            className={`leading-8 text-sm px-1/10`}
            onClick={handleSelection} // Clickhandler on the parent...nice!
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
