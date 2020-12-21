import React, { useContext } from 'react'
import { GlobalContext } from '../../contexts/GlobalContext';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = (sectProps: SectionTitleProps) => {
  const { title, subtitle } = sectProps;
  const { theme } = useContext(GlobalContext);

  return (
    <div className="flex flex-col py-4 mb-4">
      <h1 className={`text-lg ${theme.text.default} font-bold`}>{title}</h1>
      <h2 className={`text-sm ${theme.text.secondary} font-bold`}>{subtitle ? subtitle : ''}</h2>
    </div>
  )
}

export default SectionTitle