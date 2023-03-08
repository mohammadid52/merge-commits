import React from 'react';

const Empty = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flex justify-center text-gray-500 items-center p-12 ${className}`}>
      {children}
    </div>
  );
};

export default Empty;
