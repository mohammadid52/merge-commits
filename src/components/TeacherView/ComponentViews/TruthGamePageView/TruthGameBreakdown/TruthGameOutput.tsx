import React, { useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface TruthGameOutputProps {
  truthGameData?: any;
  fullscreen?: boolean;
}

const TruthGameOutput: React.FC<TruthGameOutputProps> = (props: TruthGameOutputProps) => {
  const { theme } = useContext(LessonControlContext);
  const { truthGameData, fullscreen } = props;

  return (
    <div className={`w-full flex flex-col`}>
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
