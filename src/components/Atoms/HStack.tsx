import React from 'react';

const HStack = ({
  children,
  spacing = 'gap-x-4',
  justify = 'center',
  className = ''
}: {
  spacing?: string;
  className?: string;
  justify?: 'between' | 'center' | 'flex-start' | 'flex-end' | 'evenly';
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`flex w-auto justify-${justify} ${spacing} items-center ${className}`}>
      {children}
    </div>
  );
};

export default HStack;
