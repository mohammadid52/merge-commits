import React from 'react';
import { QuoteWidget } from './TopWidgets';

const TopWidgetBar = () => {
  return (
    <div className={`h-16 w-full`}>
      <QuoteWidget />
    </div>
  );
};

export default TopWidgetBar;
