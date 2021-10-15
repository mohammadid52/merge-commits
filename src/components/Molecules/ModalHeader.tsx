import {GlobalContext} from '@contexts/GlobalContext';
import React, {useContext} from 'react';
import {IconContext} from 'react-icons';
import {IoClose} from 'react-icons/io5';

const ModalHeader = (headerProps: {
  title?: string;
  onClick?: () => void;
  titleButton?: React.ReactElement;
  customTitle?: React.ReactNode;
  showBorder?: boolean;
}) => {
  const {title, onClick, showBorder, customTitle, titleButton} = headerProps;
  const {theme} = useContext(GlobalContext);

  return (
    <div className={`${theme.modals.header} ${showBorder ? 'border-b-0' : ''}`}>
      <div className="flex items-center">
        {title ? (
          <h3 className="w-auto text-xl font-semibold">{title}</h3>
        ) : customTitle ? (
          customTitle
        ) : null}
        {titleButton}
      </div>

      <button className={`ml-auto w-auto ${theme.outlineNone}`} onClick={onClick}>
        <span className="w-8 h-8 ml-4 flex cursor-pointer hover:bg-gray-200 items-center justify-center rounded transition-all duration-150">
          <IconContext.Provider value={{size: '1.5rem', color: '#000000'}}>
            <IoClose />
          </IconContext.Provider>
        </span>
      </button>
    </div>
  );
};

export default ModalHeader;
