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
    <div
      key={keyProps}
      className={`${theme.section} rounded-b-xl bg-white customShadow text-xl h-auto`}>
      <div
        className={`${hasBackground ? theme.dashboard.card : ''} ${
          theme.elem.textDark
        } ${additionalClass} rounded-b-xl`}>
        {children}
      </div>
    </div>
  );
};

export default ContentCard;
