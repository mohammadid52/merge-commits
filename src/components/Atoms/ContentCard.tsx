import React, {useContext} from 'react';
import {GlobalContext} from 'contexts/GlobalContext';

interface ContentCardProps {
  keyProps?: string | number;
  children?: React.ReactNode;
  hasBackground?: boolean;
  additionalClass?: string;
}

const ContentCard = (props: ContentCardProps) => {
  const {keyProps, children, hasBackground, additionalClass} = props;
  const {theme} = useContext(GlobalContext);
  return (
    <div key={keyProps} className={`${theme.section} text-xl h-auto`}>
      <div
        className={`${hasBackground === false ? null : theme.dashboard.card} ${
          theme.elem.textDark
        } ${additionalClass}`}>
        {children}
      </div>
    </div>
  );
};

export default ContentCard;
