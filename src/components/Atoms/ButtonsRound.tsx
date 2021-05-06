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
        ${containerBgClass !== undefined ? containerBgClass : 'bg-white'} 
        ${containerWHClass !== undefined ? containerWHClass : 'w-12 h-12'}
        flex-none flex items-center justify-center`}>
        <div
          className={`
          ${
            pointerEvents !== undefined && pointerEvents === false
              ? 'pointer-events-none'
              : ''
          }
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${
            buttonBgClass !== undefined
              ? buttonBgClass
              : 'bg-white border border-indigo-600 rounded-full hover:shadow-lg'
          }
          ${buttonWHClass !== undefined ? buttonWHClass : 'w-12 h-12'}
          flex items-center  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400`}
          onClick={onClick}>
          {Icon ? (
            <IconContext.Provider
              value={{
                className: `${
                  iconTxtColorClass !== undefined ? iconTxtColorClass : 'text-indigo-600'
                }
                w-auto h-auto mx-auto my-auto ${
                  pointerEvents !== undefined && pointerEvents === false
                    ? 'pointer-events-none'
                    : ''
                }`,
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
