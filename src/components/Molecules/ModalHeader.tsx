import {GlobalContext} from 'contexts/GlobalContext';
import React, {useContext} from 'react';
import {IconContext} from 'react-icons';
import {IoClose} from 'react-icons/io5';

export const CloseButton = ({onClick}: {onClick: () => void}) => (
  <button className={`ml-auto w-auto outline-none}`} onClick={onClick}>
    <span className="w-8 h-8 ml-4 flex cursor-pointer hover:bg-gray-200 items-center justify-center rounded transition-all duration-150">
      <IoClose size={'1.5rem'} style={{color: '#000000'}} />
    </span>
  </button>
);

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
          <h3 className="w-auto text-sm md:text-xl font-semibold">{title}</h3>
        ) : customTitle ? (
          customTitle
        ) : null}
        {titleButton}
      </div>

      <CloseButton onClick={onClick} />
    </div>
  );
};

export default ModalHeader;
