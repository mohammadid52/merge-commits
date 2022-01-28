import React from 'react';

const Button = ({
  text,
  onClick,
  width = 'w-84',
}: {
  width?: string;
  text: string | JSX.Element;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={` bg-teal-600 hover:bg-teal-700 transition-all ${width}  p-2 text-white mt-8 rounded-md px-4`}>
      {text}
    </button>
  );
};

export default Button;
