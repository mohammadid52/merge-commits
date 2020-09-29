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
        return 'transform left-0';
        break;
      case 'right':
        return 'transform right-0';
        break;
      case 'top':
        return 'transform top-0';
        break;
      case 'bottom':
        return 'transform bottom-0';
        break;
      case 'top-left':
        return 'transform top-0 left-0';
        break;
      case 'top-right':
        return 'transform top-0 right-0';
        break;
      case 'bottom-left':
        return 'transform bottom-0 left-0';
        break;
      case 'bottom-right':
        return 'transform bottom-0 left-1/2 translate-x-full';
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
    <div className='relative'>
      <div
        className='relative'
        onMouseOver={handleToolTipHover}
        onMouseOut={handleToolTipHover}>
        <IconContext.Provider value={{ size: '2rem' }}>
          <AiOutlineInfoCircle />
        </IconContext.Provider>
        <div
          className={`absolute ${
            visible ? 'block' : 'hidden'
          } ${positionString()} w-48 bg-dark-blue z-50`}>
          <p className='font-bold font-blue-300'>{toolTipProps.header}</p>
          <p className='font-light font-blue-300'>{toolTipProps.content}</p>
        </div>
      </div>
    </div>
  );
};

export default ToolTip;
