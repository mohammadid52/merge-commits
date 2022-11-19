import React, {useContext} from 'react';
import {GlobalContext} from 'contexts/GlobalContext';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  fontSize?: string;
  fontStyle?: string;
  extraClass?: string;
  spacing?: string;
  extraContainerClass?: string;
  withButton?: React.ReactElement;
  borderBottom?: boolean;
  shadowOff?: boolean;
}

const SectionTitleV3: React.FC<SectionTitleProps> = (sectProps: SectionTitleProps) => {
  const {
    title,
    subtitle,
    extraClass,
    extraContainerClass,
    withButton,
    borderBottom = false,
    fontSize = 'lg',
    fontStyle = 'semibold',
    shadowOff = false
  } = sectProps;
  const {theme} = useContext(GlobalContext);

  return (
    <div
      className={`${
        withButton ? 'flex items-center justify-between ' : ''
      } mx-auto m-auto py-4 ${
        borderBottom
          ? `px-4 border-b-0 border-gray-200 ${
              shadowOff ? '' : 'customShadow'
            } rounded-t-xl bg-white mb-0`
          : ''
      } ${extraContainerClass} `}>
      <div className={`w-auto`}>
        {title && (
          <h2 className={`text-lg 2xl:text-${fontSize} font-${fontStyle} ${extraClass}`}>
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-sm mt-2 md:mt-0 2xl:text-base text-gray-500">{subtitle}</p>
        )}
      </div>
      {withButton}
    </div>
  );
};

export default SectionTitleV3;
