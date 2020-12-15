import React from 'react'
import { IconContext } from 'react-icons/lib/esm/iconContext';

interface ButtonProps {
  type?: 'button';
  label?: string;
  onClick?: () => void;
  transparent?: boolean;
  Icon?: any;
  btnClass?: string;
  labelClass?: string
}

const Buttons: React.FC<ButtonProps> = (btnPrps: ButtonProps) => {

  const { label, Icon, transparent, type, onClick, btnClass, labelClass } = btnPrps;

  return (
    <button
      type={type}
      className={`btn btn-default btn-indigo btn-rounded btn-icon w-auto ${btnClass ? btnClass : ''}`}
      onClick={onClick}
    >
      {label ? <span className={`mx-2 ${labelClass ? labelClass : ''}`}>{label}</span> : null}
      {Icon ? <span className="w-8 h-8 flex items-center">
        <IconContext.Provider value={{ size: '1.5rem', color: '#ffffff' }}>
          <Icon />
        </IconContext.Provider>
      </span> : null}
    </button>
  )
}

export default Buttons
