import React, {useContext} from 'react';
import {GlobalContext} from '../../contexts/GlobalContext';

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
    fontStyle = 'semibold'
  } = sectProps;
  const {theme} = useContext(GlobalContext);

  return (
    <div
      className={`${
        withButton ? 'flex items-center justify-center ' : ''
      } mx-auto m-auto py-4 ${
        borderBottom
          ? 'px-4 border-b-0 border-gray-200 shadow rounded-t-lg bg-white mb-0'
          : ''
      } ${extraContainerClass} `}>
      <div className={``}>
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
