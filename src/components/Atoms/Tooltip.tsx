import React from 'react';
interface TooltipProps {
  text: string;
  children: any;
  show?: boolean;
  placement?: 'bottom' | 'top' | 'left' | 'right' | 'bottomleft';
}

const Tooltip = ({text, show = true, placement = 'right', children}: TooltipProps) => {
  if (show) {
    return (
      <div
        className="font-medium w-auto absolute"
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
