import {useGlobalContext} from 'contexts/GlobalContext';
import React from 'react';

interface ContentCardProps {
  keyProps?: string | number;
  children?: React.ReactNode;
  hasBackground?: boolean;
  additionalClass?: string;
}

const ContentCard = (props: ContentCardProps) => {
  const {keyProps, children, hasBackground, additionalClass} = props;
  const {theme} = useGlobalContext();
  return (
    <div
      key={keyProps}
      className={`${theme.section} rounded-b-xl bg-white customShadow text-xl h-auto`}>
      <div
        className={`${hasBackground ? theme.dashboard.card : ''} ${
          theme.elem.textDark
        } ${additionalClass} w-full rounded-b-xl`}>
        {children}
      </div>
    </div>
  );
};

export default ContentCard;
