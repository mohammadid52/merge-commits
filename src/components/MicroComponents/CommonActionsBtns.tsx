import Buttons from '@components/Atoms/Buttons';
import React, {useEffect, useState} from 'react';

interface ICommonActionBtns {
  button1Label?: string;
  button2Label?: string;
  button1Action?: (e: any) => void;
  button2Action?: (e: any) => void;
  isDeletable?: boolean;
  checkIfDeletable?: () => Promise<boolean>;
}

const CommonActionsBtns = ({
  button1Label = 'Edit',
  button2Label = 'Delete',
  button1Action,
  button2Action,
  checkIfDeletable
}: ICommonActionBtns) => {
  const [isDeletable, setIsDeletable] = useState(false);

  useEffect(() => {
    if (typeof checkIfDeletable === 'function') {
      checkIfDeletable().then((res) => {
        setIsDeletable(res);
      });
    }
  }, []);

  return (
    <div className="flex items-center w-auto gap-x-4">
      {button1Action && (
        <Buttons label={button1Label} onClick={button1Action} transparent size="small" />
      )}
      {button2Action && (
        <Buttons
          redBtn
          tooltip={isDeletable ? '' : 'This unit is active in course'}
          disabled={!isDeletable}
          insideElement={
            <a href="#" onMouseUp={button2Action}>
              {button2Label}
            </a>
          }
          transparent
          size="small"
        />
      )}
    </div>
  );
};

export default CommonActionsBtns;
