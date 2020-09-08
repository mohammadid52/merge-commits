import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  label?: string;
  img?: string;
  compClass?: string;
  func?: () => void;
}

const ActionButton: React.FC<ButtonProps> = (btnPrps: ButtonProps) => {
  return (
    <>
      <a href='#' onClick={btnPrps.func} className={btnPrps.compClass}>
        {btnPrps.label}
      </a>
    </>
  );
};

export default ActionButton;
