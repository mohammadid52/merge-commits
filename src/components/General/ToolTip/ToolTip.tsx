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
    | 'hidden-bottom'
    | 'bottom-left'
    | 'bottom-right';
  color?: string;
  header: string;
  content?: React.ReactNode;
  display?: string;
  fontSize?: string;
  width?: string;
  cursor?: boolean;
  id?: string;
  style?: string;
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
        return 'transform translate-y-6';
        break;
      case 'hidden-bottom':
        return 'transform translate-y-12';
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
    <div className={`${toolTipProps.display === 'none' ? 'absolute w-full h-full' : 'w-8 h-8'} ${toolTipProps.style ? `${toolTipProps.style}` : ''}`} style={{
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      /* pointerEvents: 'none' */
    }} id={toolTipProps.id ? toolTipProps.id : null}>
      <div
        className={`${toolTipProps.display === 'none' ? 'w-full h-full' : 'w-8 h-8'} ${toolTipProps.cursor ? 'cursor-pointer' : 'cursor-help' } relative flex justify-center z-10 `}
        onMouseOver={handleToolTipHover}
        onMouseOut={handleToolTipHover}
        id={toolTipProps.id ? toolTipProps.id : null}>
        <IconContext.Provider value={{ size: '1.2rem', color: toolTipProps.color || 'white', style: {display: toolTipProps.display}  }}>
          <div className='animate-pulse flex justify-center items-center' id={toolTipProps.id ? toolTipProps.id : null}>
            <AiOutlineInfoCircle />
          </div>
        </IconContext.Provider>
        <span
          id={toolTipProps.id ? toolTipProps.id : null}
          className={`absolute ${
            visible ? 'block' : 'hidden'
          } ${positionString()} text-dark p-1 ${toolTipProps.width ? toolTipProps.width : 'w-auto'} bg-white rounded-lg shadow-elem-semi-dark z-50 border border-blueberry flex flex-col justify-center items-center`}>
          <p id={toolTipProps.id ? toolTipProps.id : null} className={`${toolTipProps.fontSize ? toolTipProps.fontSize : 'text-sm'} ${toolTipProps.header === '' ? 'hidden' : '' } text-left font-bold font-blue-300`}>{toolTipProps.header}</p>
          <div id={toolTipProps.id ? toolTipProps.id : null} className={`${toolTipProps.fontSize ? toolTipProps.fontSize : 'text-sm'} flex text-center font-light font-blue-300`}>
            {toolTipProps.content}
          </div>
        </span>
      </div>
    </div>
    );
  };
export default ToolTip;