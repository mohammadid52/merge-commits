import React, {useContext} from 'react';
import {IconContext} from 'react-icons';
import {IoClose} from 'react-icons/io5';

import {GlobalContext} from '../../contexts/GlobalContext';

interface ModalProps {
  inside?: boolean;
  showHeader: boolean;
  title?: string;
  showHeaderBorder?: boolean;
  showFooter: boolean;
  children: React.ReactNode;
  saveAction?: () => void;
  closeAction?: () => void;
}

const ModalHeader = (headerProps: {
  title?: string;
  onClick?: () => void;
  showBorder?: boolean;
}) => {
  const {title, onClick, showBorder} = headerProps;
  const {theme} = useContext(GlobalContext);

  return (
    <div className={`${theme.modals.header} ${showBorder ? 'border-b-0' : ''}`}>
      <h3 className="text-xl font-semibold">{title && title}</h3>
      <button className={`ml-auto w-auto ${theme.outlineNone}`} onClick={onClick}>
        <span className="w-6 ml-4 flex cursor-pointer">
          <IconContext.Provider value={{size: '1.5rem', color: '#000000'}}>
            <IoClose />
          </IconContext.Provider>
        </span>
      </button>
    </div>
  );
};

const ModalBody = (bodyProps: {children: React.ReactNode}) => {
  const {children} = bodyProps;
  return (
    <div className="relative p-4 flex flex-auto justify-center bg-white rounded-b">
      {children}
    </div>
  );
};

const ModalFooter = (footerProps: {onSave?: () => void; onClose?: () => void}) => {
  const {onSave, onClose} = footerProps;
  const {theme} = useContext(GlobalContext);

  return (
    <div className={`${theme.modals.footer}`}>
      <button className="btn btn-flat btn-red" type="button" onClick={onClose}>
        Close
      </button>
      <button
        className="btn btn-default btn-green btn-rounded"
        type="button"
        onClick={onSave}>
        Save Changes
      </button>
    </div>
  );
};

const ModalInside: React.FC<ModalProps> = (modalProps: ModalProps) => {
  const {
    inside,
    showHeader,
    title,
    showHeaderBorder,
    showFooter,
    children,
    closeAction,
    saveAction,
  } = modalProps;
  const {theme} = useContext(GlobalContext);

  return (
    <div
      className={`
        z-50 w-full h-0
        outline-none focus:outline-none`}>
      <div className={`relative mx-auto my-auto w-auto max-w-256 bg-white rounded`}>
        <button
          className="absolute right-0 w-6 m-4 flex z-100 cursor-pointer"
          onClick={closeAction}>
          <IconContext.Provider value={{size: '1.5rem', color: '#000000'}}>
            <IoClose />
          </IconContext.Provider>
        </button>
        <ModalBody>{children}</ModalBody>
        {showFooter && <ModalFooter onSave={saveAction} onClose={closeAction} />}
      </div>
    </div>
  );
};

export default ModalInside;
