import React from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {IconType} from 'react-icons';

interface ButtonRoundProps {
  onClick?: () => void;
  Icon?: IconType;
  iconSizePX?: number;
  containerBgClass?: string;
  containerWHClass?: string;
  buttonBgClass?: string;
  buttonWHClass?: string;
  iconTxtColorClass?: string;
  disabled?: boolean;
  pointerEvents?: boolean;
}

const ButtonsRound: React.FC<ButtonRoundProps> = (props: ButtonRoundProps) => {
  const {
    Icon,
    iconSizePX,
    containerBgClass,
    containerWHClass,
    buttonBgClass,
    buttonWHClass,
    iconTxtColorClass,
    onClick,
    disabled,
    pointerEvents,
  } = props;

  return (
    <>
      <div
        className={`
        ${
          pointerEvents !== undefined && pointerEvents === false
            ? 'pointer-events-none'
            : ''
        }
        ${containerBgClass ? containerBgClass : 'bg-white'} 
        ${containerWHClass ? containerWHClass : 'w-12 h-12'}
        flex-none flex items-center justify-center`}>
        <div
          className={`
          ${
            pointerEvents !== undefined && pointerEvents === false
              ? 'pointer-events-none'
              : ''
          }
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${buttonBgClass ? buttonBgClass : 'bg-white'}
          ${buttonWHClass ? buttonWHClass : 'w-12 h-12'}
          flex items-center border border-indigo-600 
          shadow-sm rounded-full hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400`}
          onClick={onClick}>
          {Icon ? (
            <IconContext.Provider
              value={{
                className: `${iconTxtColorClass ? iconTxtColorClass : 'text-indigo-600'}
                w-auto h-auto mx-auto my-auto pointer-events-none`,
              }}>
              <Icon size={iconSizePX ? iconSizePX : 32} />
            </IconContext.Provider>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ButtonsRound;