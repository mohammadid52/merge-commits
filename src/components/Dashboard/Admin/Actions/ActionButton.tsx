import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  type?: 'button' | 'submit';
  label?: string;
  img?: string;
  compClass?: string;
  func?: () => void;
}

const ActionButton: React.FC<ButtonProps> = (btnPrps: ButtonProps) => {
  return (
    <p className="flex">
      <br />
      <button
        type={btnPrps.type}
        onClick={btnPrps.func}
        className={btnPrps.compClass}>
        {btnPrps.label}
      </button>
    </p>
  );
};

export default ActionButton;
