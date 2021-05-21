import React, {useContext} from 'react';
import {IconContext} from 'react-icons';
import {IoClose} from 'react-icons/io5';

import {GlobalContext} from '../../contexts/GlobalContext';

interface ModalProps {
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
        <span className="w-8 h-8 ml-4 flex cursor-pointer hover:bg-gray-200 items-center justify-center rounded transition-all duration-150">
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
  return <div className="relative p-4 flex-auto">{children}</div>;
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

const Modal: React.FC<ModalProps> = (modalProps: ModalProps) => {
  const {
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
    <>
      <div className="backdrop fade-in fixed inset-0 z-40 bg-black"></div>
      <div className="modal show justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-4 mx-auto max-w-lg">
          <div className={`${theme.modals.content}`}>
            {showHeader && (
              <ModalHeader
                title={title}
                onClick={closeAction}
                showBorder={showHeaderBorder}
              />
            )}
            <ModalBody>{children}</ModalBody>
            {showFooter && <ModalFooter onSave={saveAction} onClose={closeAction} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
