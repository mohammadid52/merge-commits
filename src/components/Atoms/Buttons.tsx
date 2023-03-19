import {Button} from 'antd';
import {SizeType} from 'antd/es/config-provider/SizeContext';
import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  label?: string | any;
  onClick?: (event?: any) => void;
  transparent?: boolean;
  redBtn?: boolean;
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
  size?: SizeType;
  iconSize?: string;
  variant?: 'link' | 'text' | 'default' | 'primary' | 'ghost' | 'dashed';
  className?: string;
}

const Buttons: React.FC<ButtonProps> = (btnProps: ButtonProps): React.ReactElement => {
  const {
    label,
    Icon,

    redBtn,
    variant = 'primary',

    transparent,
    type = 'button',
    onClick,

    disabled,

    loading = false,

    insideElement = null,

    size = 'large',
    className
  } = btnProps;

  return (
    <Button
      loading={loading}
      danger={redBtn}
      className={`${className} flex items-center justify-center`}
      htmlType={type}
      size={size}
      // style={{borderRadius: 999}}
      type={transparent ? 'default' : variant}
      disabled={disabled}
      icon={Icon ? <Icon /> : undefined}
      onClick={onClick}>
      {label}
      {insideElement}
    </Button>
    //     <button
    //       data-cy={dataCy}
    //       title={title}
    //       disabled={disabled || loading}
    //       type={type ? type : "button"}
    //       style={customStyles}
    //       className={`
    //       ${
    //         overrideClass
    //           ? ""
    //           : `${
    //               transparent
    //                 ? `${
    //                     greenBtn
    //                       ? ""
    //                       : redBtn
    //                       ? ""
    //                       : "theme-border theme-text hover-text-white"
    //                   }`
    //                 : `${
    //                     greenBtn
    //                       ? ""
    //                       : redBtn
    //                       ? ""
    //                       : ` theme-bg:500 theme-card-shadow`
    //                   }`
    //             } font-bold transition duration-150 text-white ease-in-out ${
    //               size === "small" ? "" : "md:py-2"
    //             } sm:py-auto  ${
    //               greenBtn ? "" : redBtn ? "" : "hover:theme-bg:600"
    //             } uppercase text-xs ${
    //               size === "small" ? "px-2 py-1" : "px-4 py-2"
    //             } rounded-full flex items-center justify-center w-auto `
    //       }

    //       ${variant === "secondary" ? "opacity-50" : ""}
    //       ${btnClass ? btnClass : ""}
    //       ${transparent ? "transparent" : ""}
    //       ${theme.outlineNone}
    // ${redBtn ? "red-btn " : ""}
    //       ${
    //         transparent
    //           ? `bg-transparent  ${redBtn ? "" : "theme-border"} border-0`
    //           : !overrideClass
    //           ? `${
    //               variant === "secondary" || disabled
    //                 ? "bg-gray-400 text-gray-200"
    //                 : theme.btn[themeColor]
    //             }`
    //           : ""
    //       }
    //       ${
    //         disabled
    //           ? "cursor-not-allowed opacity-50 pointer-events-none"
    //           : "cursor-pointer "
    //       }
    //       ${greenBtn ? "green-btn" : ""}
    //       ${
    //         redBtn && transparent
    //           ? "border-red-500 hover:bg-red-500 hover:text-white red-btn text-red-500"
    //           : redBtn && !transparent
    //           ? "bg-red-500 hover:bg-red-600 text-white"
    //           : ""
    //       }
    //       `}
    //       onClick={onClick}
    //     >
    //       {loading ? (
    //         <Loader withText={loadingText} className="w-auto text-gray-400" />
    //       ) : (
    //         <div className="w-auto flex items-center justify-center">
    //           {Icon && iconBeforeLabel ? <_Icon /> : null}
    //           {label ? (
    //             <span className={`mx-2 ${labelClass ? labelClass : ""}`}>
    //               {label}
    //             </span>
    //           ) : null}
    //           {Icon && !iconBeforeLabel ? <_Icon /> : null}
    //         </div>
    //       )}

    //       {
    //         <div
    //           className={`${
    //             disabled ? "cursor-not-allowed pointer-events-none" : ""
    //           } w-auto`}
    //         >
    //           {insideElement}
    //         </div>
    //       }
    //     </button>
  );
};

export default Buttons;
