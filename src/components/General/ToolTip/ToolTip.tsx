import React from 'react';

interface ToolTipProps {
  children?: React.ReactNode;
  position: 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  header: string;
  content: string;
}

const ToolTip: React.FC = (toolTipProps: ToolTipProps) => {
  return (<div className='tooltip'><p>Header1</p><p>Description...</p></div>)
}

export default ToolTip;