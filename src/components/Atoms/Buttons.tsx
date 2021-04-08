import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { GlobalContext } from '../../contexts/GlobalContext';
import { getAsset } from '../../assets';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  label?: string;
  onClick?: () => void;
  transparent?: boolean;
  Icon?: any;
  btnClass?: string;
  labelClass?: string;
  disabled?: boolean;
}

const Buttons: React.FC<ButtonProps> = (btnPrps: ButtonProps) => {
  const { label, Icon, transparent, type, onClick, btnClass, labelClass, disabled } = btnPrps;
  const { theme, clientKey } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  return (
    <button
      disabled={disabled}
      type={type ? type : 'button'}
      className={`font-bold uppercase text-xs px-4 py-2 rounded-lg flex items-center justify-center w-auto ${
        theme.outlineNone
      } ${transparent ? theme.btn.cancel : theme.btn[themeColor]} ${btnClass ? btnClass : ''} ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={onClick}>
      {label ? <span className={`mx-2 ${labelClass ? labelClass : ''}`}>{label}</span> : null}
      {Icon ? (
        <span className="w-8 h-8 flex items-center">
          <IconContext.Provider value={{ size: '1.5rem', color: '#ffffff' }}>
            <Icon />
          </IconContext.Provider>
        </span>
      ) : null}
    </button>
  );
};

export default Buttons;
