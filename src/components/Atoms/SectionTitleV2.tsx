import React, { useContext } from 'react'
import { GlobalContext } from '../../contexts/GlobalContext';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitleV2: React.FC<SectionTitleProps> = (sectProps: SectionTitleProps) => {
  const { title, subtitle } = sectProps;
  const { theme } = useContext(GlobalContext);

  return (
    <div className={`bg-opacity-10`}>
      <div className={`${theme.section} px-4 pb-4 m-auto`}>
        <h2 className={`w-full flex text-xl border-b-0 border-dark-gray pb-1 ${theme.dashboard.sectionTitle}`}>
            <span>
              {title}
            </span>
          <span className={`mr-0 text-right`}>
              {subtitle}
            </span>
        </h2>
      </div>
    </div>
  )
}

export default SectionTitleV2;