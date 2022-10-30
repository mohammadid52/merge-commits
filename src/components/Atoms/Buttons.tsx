import React, {useContext} from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {GlobalContext} from 'contexts/GlobalContext';
import {getAsset} from 'assets';
import Loader from 'atoms/Loader';

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
  greenBtn?: boolean;
  customStyles?: object;
  loading?: boolean;
  loadingText?: string;
  insideElement?: React.ReactNode;
  title?: string;
  dataCy?: string;
}

const Buttons: React.FC<ButtonProps> = (btnProps: ButtonProps) => {
  const {
    label,
    Icon,
    title,
    greenBtn,
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
    insideElement = null,
    dataCy
  } = btnProps;
  const {theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  return (
    <button
      data-cy={dataCy}
      title={title}
      disabled={disabled || loading}
      type={type ? type : 'button'}
      style={customStyles}
      className={`
      ${
        overrideClass
          ? ''
          : `${
              transparent
                ? `${
                    greenBtn
                      ? ''
                      : 'iconoclast:border-main  curate:border-main iconoclast:text-main curate:text-main hover-text-white'
                  }`
                : `${greenBtn ? '' : 'iconoclast:bg-500 curate:bg-500'}`
            } font-bold transition duration-150 text-white ease-in-out md:py-2 sm:py-auto  ${
              greenBtn ? '' : 'hover:iconoclast:bg-600  hover:curate:bg-600'
            } uppercase text-xs px-4 py-2 rounded-lg flex items-center justify-center w-auto `
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
      ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} 
      ${greenBtn ? 'green-btn' : ''}
      `}
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
