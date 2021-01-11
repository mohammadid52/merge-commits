import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';

interface TruthGameOutputProps {
  truthGameData?: any;
}

const TruthGameOutput: React.FC<TruthGameOutputProps> = (props: TruthGameOutputProps) => {
  const { theme } = useContext(LessonContext);
  const { truthGameData } = props;

  return (
    <div className={`w-full flex flex-col`}>
      {/*{console.log('truthGame output: ', truthGameData ? truthGameData : '')}*/}

      {truthGameData
        ? truthGameData.map((item: { id: string; label: string; isLie: boolean; text: string }, key: number) => {
            return (
              <div className={`p-4`}>
                <div className={`${theme.elem.text} align-middle text-left`}>{`${item.label}:`}</div>
                <span className={`${item.isLie ? 'text-lg' : 'hidden'}`}> (this is your lie 🤥)</span>
                <div className={`${theme.elem.text} align-middle text-left`}>{item.text}</div>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default TruthGameOutput;
