import React, { useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  fontSize?: string;
  fontStyle?: string;
  extraClass?: string;
  withButton?: React.ReactElement;
  borderBottom?: boolean;
}

const SectionTitleV3: React.FC<SectionTitleProps> = (sectProps: SectionTitleProps) => {
  const {
    title,
    subtitle,
    withButton,
    borderBottom = true,
    fontSize = '2xl',
    fontStyle = 'bold',
    extraClass,
  } = sectProps;
  const { theme } = useContext(GlobalContext);

  return (
    <div
      className={`${withButton ? 'flex items-center justify-center' : ''} max-w-256 mx-auto m-auto px-4 py-5 ${
        borderBottom ? 'border-b-0 border-gray-200 shadow rounded-t-lg bg-white' : ''
      }`}>
      <div className={``}>
        <h2 className={`text-${fontSize} font-${fontStyle} ${extraClass}`}>{title}</h2>
        <p className="text-md text-gray-500">{subtitle}</p>
      </div>
      {withButton}
    </div>
  );
};

export default SectionTitleV3;
