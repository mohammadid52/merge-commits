import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';

interface ContentCardProps {
  keyProps?: string | number;
  children?: React.ReactNode;
}

const ContentCard = (props: ContentCardProps) => {
  const {keyProps, children} = props;
  const { theme } = useContext(GlobalContext);
  return (
    <div key={keyProps} className={`${theme.section} p-4 text-xl h-32`}>
      <div className={`${theme.dashboard.card} ${theme.elem.textDark}`}>
        {children}
      </div>
    </div>
  );
};

export default ContentCard;
