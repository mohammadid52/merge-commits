import React, { useState, useEffect } from 'react';
import { IconContext } from 'react-icons';
import { AiOutlineInfoCircle } from 'react-icons/ai';

interface ToolTipProps {
  children?: React.ReactNode;
  position:
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
  header: string;
  content: string;
}

const ToolTip: React.FC<ToolTipProps> = (toolTipProps: ToolTipProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<string>('');

  const positionString = () => {
    switch (position) {
      case 'left':
        return 'transform right-1/2';
        break;
      case 'right':
        return 'transform left-1/2';
        break;
      case 'top':
        return 'transform -translate-y-4';
        break;
      case 'bottom':
        return 'transform translate-y-0';
        break;
      case 'top-left':
        return 'transform -translate-y-4 right-1/2';
        break;
      case 'top-right':
        return 'transform -translate-y-4 left-1/2';
        break;
      case 'bottom-left':
        return 'transform translate-y-0 right-1/2';
        break;
      case 'bottom-right':
        return 'transform translate-y-0 left-1/2';
        break;
      default:
        return '';
        break;
    }
  };

  const handleToolTipHover = (e: React.MouseEvent) => {
    setVisible((prevState) => !prevState);
  };

  useEffect(() => {
    if (typeof toolTipProps.position !== 'undefined') {
      setPosition(toolTipProps.position);
    }
  }, []);

  return (
    <>
      <div
        className='w-8 h-8 relative inline-block z-50'
        onMouseOver={handleToolTipHover}
        onMouseOut={handleToolTipHover}>
        <IconContext.Provider value={{ size: '2rem', color: 'white' }}>
          <div className='animate-pulse'>
            <AiOutlineInfoCircle />
          </div>
        </IconContext.Provider>
        <span
          className={`absolute ${
            visible ? 'block' : 'hidden'
          } ${positionString()}  text-dark p-2 w-48 bg-white rounded-lg animate-fadeIn shadow-elem-semi-dark z-50 border border-blueberry `}>
          <p className='text-left text-sm font-bold font-blue-300'>{toolTipProps.header}</p>
          <p className='text-justify text-sm font-light font-blue-300'>{toolTipProps.content}</p>
        </span>
      </div>
    </>
  );
};

export default ToolTip;
