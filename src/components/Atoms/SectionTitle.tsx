import React from 'react';


interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = (sectProps: SectionTitleProps) => {
  const { title, subtitle } = sectProps
  return (
    <div className="flex flex-col py-4 mb-4">
      <h1 className="text-lg text-default font-bold">{title}</h1>
      <h2 className="text-sm text-secondary font-bold">{subtitle ? subtitle : ''}</h2>
    </div>
  )
}

export default SectionTitle