import React from 'react'

interface ButtonProps {
  type?: 'button';
  label: string;
  onClick?: () => void;
  transparent?: boolean;
  Icon?: any;
  btnClass?: string;
  labelClass?: string
}
// TODO : MAke icons work.

const Buttons: React.FC<ButtonProps> = (btnPrps: ButtonProps) => {

  const { label, Icon, transparent, type, onClick, btnClass, labelClass } = btnPrps;

  return (
    <button
      type={type}
      className={`btn btn-default btn-indigo btn-rounded btn-icon w-auto ${btnClass ? btnClass : ''}`}
      onClick={onClick}
    >
      {label ? <span className={`mx-2 ${labelClass ? labelClass : ''}`}>{label}</span> : null}
      {Icon ? <span className=""><Icon /></span> : null}
    </button>
  )
}

export default Buttons
