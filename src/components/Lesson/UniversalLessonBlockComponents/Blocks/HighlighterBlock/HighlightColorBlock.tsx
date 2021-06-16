import React from 'react';
import {IconContext} from 'react-icons';
import {FaEraser, FaHighlighter} from 'react-icons/fa';
import ToolTip from '../../../../General/ToolTip/ToolTip';

interface HighlightColorBlockProps {
  setColor: React.Dispatch<React.SetStateAction<string>>;
  color: string;
}

const HighlightColorBlock = (props: HighlightColorBlockProps) => {
  const {setColor, color} = props;

  const buttons = [{color: 'mustard', name: 'Yellow'}];

  const handleClick = (e: any) => {
    setColor(e.target.id);
  };

  return (
    <>
      <div
        className={`
        relative w-auto pb-2 mb-2  mt-4 flex flex-row items-center border-b-4 border-sea-green font-medium text-left text-gray-100 text-xl`}
        style={{marginTop: '0', paddingBottom: '0'}}>
        <div className="w-3.3/10  flex flex-col justify-center items-center">
          <span>Select Highlighter:</span>
        </div>
        <div className={`w-3.3/10  flex  justify-center items-center z-50`}>
          <div className={`w-auto cursor-pointer flex flex-row`}>
            {/**
             *
             *
             * HIGHLIGHTER BUTTONSZ
             *
             *
             **/}
            {buttons &&
              buttons.reduce(
                (
                  acc: any[],
                  button: {color: string; icon: string; name: string},
                  key: number
                ) => {
                  if (key === 0) {
                    return (
                      <div
                        key={key}
                        id={button.color}
                        className={`${
                          color === button.color ? 'border-2 border-white' : ''
                        } 
                      bg-${button.color} 
                      relative h-12 w-12 text-3xl rounded-lg mx-2 flex flex-row justify-center items-center
                       `}
                        onClick={handleClick}>
                        <ToolTip
                          position="bottom"
                          id={button.color}
                          cursor
                          header=""
                          width="w-24 px-1 flex justify-center items-center"
                          content={
                            <div className="flex text-center justify-center w-24">
                              {button.name}
                            </div>
                          }
                          display="none"
                          fontSize="text-xs"
                        />
                        {/*{button.icon}*/}
                        <IconContext.Provider value={{color: 'white', size: '2rem'}}>
                          <FaHighlighter style={{pointerEvents: 'none'}} />
                        </IconContext.Provider>
                      </div>
                    );
                  } else {
                    return acc;
                  }
                },
                []
              )}

            <div
              id="erase"
              className={`relative bg-gray-200 h-12 w-12 text-3xl rounded-lg mb-2 mx-2 flex flex-row justify-center items-center`}
              onClick={handleClick}>
              <ToolTip
                position="bottom"
                id={'erase'}
                cursor
                header=""
                width="w-24 px-1 flex justify-center items-center"
                content={
                  <div className="flex text-center justify-center w-24">{'erase'}</div>
                }
                display="none"
                fontSize="text-xs"
              />
              <IconContext.Provider value={{color: 'darkgray', size: '2rem'}}>
                <FaEraser style={{pointerEvents: 'none'}} />
              </IconContext.Provider>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full leading-6 border-b-0 border-white border-opacity-10 mb-4">
        <p className="pl-2 text-sm text-left text-white">
          1. <b>Click 2 separate words</b> to select a sentence.
        </p>
        <p className="pl-2 text-sm text-left text-white">
          2. <b>Double-Click 1 word</b> to select a word.
        </p>
      </div>
    </>
  );
};

export default HighlightColorBlock;
