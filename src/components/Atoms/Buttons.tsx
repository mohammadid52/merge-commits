import React, {useContext} from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {GlobalContext} from '../../contexts/GlobalContext';
import {getAsset} from '../../assets';
import Loader from '@components/Atoms/Loader';

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
  loading?: boolean;
  loadingText?: string;
  insideElement?: React.ReactNode;
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
    loading = false,
    loadingText = 'Loading...',
    insideElement = null
  } = btnProps;
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  return (
    <button
      disabled={disabled || loading}
      type={type ? type : 'button'}
      style={customStyles}
      className={`
      ${
        overrideClass
          ? ''
          : `${
              transparent
                ? 'iconoclast:border-main hover:text-white curate:border-main iconoclast:text-main curate:text-main'
                : 'iconoclast:bg-main curate:bg-main'
            } font-bold transition duration-150 text-white ease-in-out md:py-2 sm:py-auto  hover:iconoclast:bg-500  hover:curate:bg-500 uppercase text-xs px-4 py-2 rounded-lg flex items-center justify-center w-auto`
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
      {loading ? (
        <Loader withText={loadingText} className="w-auto text-gray-400" />
      ) : (
        <div className="w-auto flex items-center justify-center">
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
        </div>
      )}

      {insideElement}
    </button>
  );
};

export default Buttons;
