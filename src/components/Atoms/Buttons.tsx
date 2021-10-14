import React, {useContext} from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {GlobalContext} from '../../contexts/GlobalContext';
import {getAsset} from '../../assets';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  label?: string | any;
  onClick?: (event?: any) => void;
  transparent?: boolean;
  Icon?: any;
  btnClass?: string;
  overrideClass?: boolean;
  labelClass?: string;
  iconBeforeLabel?: boolean;
  disabled?: boolean;
  customStyles?: object;
}

const Buttons: React.FC<ButtonProps> = (btnProps: ButtonProps) => {
  const {
    label,
    Icon,
    iconBeforeLabel,
    transparent,
    type,
    onClick,
    btnClass,
    overrideClass,
    labelClass,
    disabled,
    customStyles,
  } = btnProps;
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  return (
    <button
      disabled={disabled}
      type={type ? type : 'button'}
      style={customStyles}
      className={`
      ${
        overrideClass
          ? ''
          : 'font-bold uppercase text-xs px-4 py-2 rounded-lg flex items-center justify-center w-auto'
      }
      ${btnClass ? btnClass : ''} 
      ${theme.outlineNone} 
      ${
        transparent
          ? theme.btn.cancel
          : !overrideClass
          ? `${disabled ? 'bg-gray-400 text-gray-200' : theme.btn[themeColor]}`
          : ''
      } 
      ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} `}
      onClick={onClick}>
      {Icon && iconBeforeLabel && (
        <span className="w-auto">
          <IconContext.Provider value={{color: '#ffffff'}}>
            <Icon className="w-6 h-6" />
          </IconContext.Provider>
        </span>
      )}
      {label ? (
        <span className={`mx-2 ${labelClass ? labelClass : ''}`}>{label}</span>
      ) : null}
      {Icon && !iconBeforeLabel ? (
        <span className="w-8 h-8 flex items-center">
          <IconContext.Provider value={{size: '1.2rem', color: '#ffffff'}}>
            <Icon />
          </IconContext.Provider>
        </span>
      ) : null}
    </button>
  );
};

export default Buttons;
