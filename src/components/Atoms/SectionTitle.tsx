import React, {useContext} from 'react';
import {GlobalContext} from 'contexts/GlobalContext';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = (sectProps: SectionTitleProps) => {
  const {title, subtitle} = sectProps;
  const {theme} = useContext(GlobalContext);

  return (
    <div className="flex flex-col py-2 2xl:py-4 mb-0 md:mb-4">
      <h1 className={`text-sm 2xl:text-lg ${theme.text.default} font-bold`}>
        {title.toUpperCase()}
      </h1>
      <h2 className={`text-xs 2xl:text-sm ${theme.text.secondary} font-bold`}>
        {subtitle ? subtitle : ''}
      </h2>
    </div>
  );
};

export default SectionTitle;
