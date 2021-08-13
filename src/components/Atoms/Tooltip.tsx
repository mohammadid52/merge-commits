import React from 'react';
interface TooltipProps {
  text: string;
  id?: string;
  children: any;
  show?: boolean;
  placement?: 'bottom' | 'top' | 'left' | 'right' | 'bottomleft';
  additionalClass?: string;
}
/**  
 @text the main text content
 @show to show/hide tooltip. default true
**/
const Tooltip = ({
  text,
  id,
  show = true,
  placement = 'right',
  children,
  additionalClass = '',
}: TooltipProps) => {
  if (show) {
    return (
      <div
        id={id}
        className={`font-medium w-auto absolute ${additionalClass}`}
        data-tooltip={text}
        data-tooltip-location={placement}>
        {children}
      </div>
    );
  } else {
    return children;
  }
};

export default Tooltip;
