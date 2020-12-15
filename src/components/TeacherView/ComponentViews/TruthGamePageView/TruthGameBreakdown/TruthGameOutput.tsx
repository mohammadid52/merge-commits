import React, { useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface TruthGameOutputProps {
  truthGameData: any;
}

const TruthGameOutput: React.FC<TruthGameOutputProps> = (props: TruthGameOutputProps) => {
  const { truthGameData } = props;

  return (
    <div className={`w-full flex flex-col`}>
      {truthGameData
        ? truthGameData.truthGameArray.map(
            (item: { id: string; label: string; isLie: boolean; text: string }, key: number) => {
              return (
                <div className={`p-4`}>
                  <div className={`text-2xl`}>{`${item.label}:`}</div>
                  <span className={`${item.isLie ? 'text-lg' : 'hidden'}`}> (this is your lie 🤥)</span>
                  <div className={`text-xl`}>{item.text}</div>
                </div>
              );
            }
          )
        : null}
    </div>
  );
};

export default TruthGameOutput;
