import React, { useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitleV2: React.FC<SectionTitleProps> = (sectProps: SectionTitleProps) => {
  const { title, subtitle } = sectProps;
  const { theme } = useContext(GlobalContext);

  return (
    <div className={`bg-opacity-10 pt-6`}>
      <div className={`${theme.section} py-4 m-auto`}>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-md text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

export default SectionTitleV2;
