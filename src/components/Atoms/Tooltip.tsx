import React from 'react';
interface TooltipProps {
  text: string;
  children: any;
  placement?: 'bottom' | 'top' | 'left' | 'right' | 'bottomleft';
}

const Tooltip = ({text, placement = 'right', children}: TooltipProps) => {
  return (
    <div className="font-medium" data-tooltip={text} data-tooltip-location={placement}>
      {children}
    </div>
  );
};

export default Tooltip;
