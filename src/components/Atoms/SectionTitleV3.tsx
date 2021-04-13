import React, { useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  fontSize?: string;
  fontStyle?: string;
  extraClass?: string;
  spacing?: string;
  extraContainerClass?: string;
}

const SectionTitleV3: React.FC<SectionTitleProps> = (sectProps: SectionTitleProps) => {
  const {
    title,
    subtitle,
    fontSize = '2xl',
    fontStyle = 'bold',
    extraClass,
    extraContainerClass,
    spacing = 'py-4',
  } = sectProps;
  const { theme } = useContext(GlobalContext);

  return (
    <div className={`bg-opacity-10`}>
      <div className={`m-auto ${spacing} ${extraContainerClass}`}>
        <h2 className={`text-${fontSize} font-${fontStyle} ${extraClass}`}>{title}</h2>
        <p className="text-md text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

export default SectionTitleV3;
