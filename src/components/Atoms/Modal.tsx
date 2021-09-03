import React, {useContext, useEffect} from 'react';
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
  isImage?: boolean;
  closeOnBackdrop?: boolean;
  hidePadding?: boolean;
  intenseOpacity?: boolean;
  scrollHidden?: boolean;
  titleButton?: React.ReactElement;
  customTitle?: React.ReactNode;
}

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

const ModalBody = (bodyProps: {
  children: React.ReactNode;
  hidePadding?: boolean;
  closeOnBackdrop?: boolean;
  scrollHidden?: boolean;
}) => {
  const {children, closeOnBackdrop, scrollHidden, hidePadding} = bodyProps;
  return (
    <div
      className={`relative ${
        hidePadding ? 'p-0' : `${closeOnBackdrop ? 'p-2' : 'p-4'}`
      } flex-auto overflow-y-${scrollHidden ? 'hidden' : 'scroll'}`}
      style={{maxHeight: 'calc(100vh - 150px)'}}>
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

const Modal: React.FC<ModalProps> = (modalProps: ModalProps) => {
  const {
    showHeader,
    title,
    showHeaderBorder,
    showFooter,
    children,
    intenseOpacity = false,
    closeAction,
    saveAction,
    closeOnBackdrop = false,
    titleButton,
    hidePadding = false,
    scrollHidden = false,
    customTitle,
  } = modalProps;
  const {theme} = useContext(GlobalContext);
  useEffect(() => {
    const close = (e: any) => {
      // close modal on ESC press
      if (e.keyCode === 27) {
        closeAction();
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  });
  return (
    <>
      <div
        className={`${
          intenseOpacity ? 'dark-backdrop' : 'backdrop fade-in'
        } fixed inset-0 z-40 bg-black`}></div>
      <div
        onClick={() => closeOnBackdrop && closeAction()}
        className="fixed modal show justify-center items-center flex overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none">
        <div
          onClick={(e) => {
            if (closeOnBackdrop) {
              e.stopPropagation();
            }
          }}
          className="relative w-auto my-4 mx-auto max-w-lg">
          <div className={`${theme.modals[hidePadding ? 'hideBg' : 'content']}`}>
            {showHeader && (
              <ModalHeader
                titleButton={titleButton}
                customTitle={customTitle}
                title={title}
                onClick={closeAction}
                showBorder={showHeaderBorder}
              />
            )}
            <ModalBody
              scrollHidden={scrollHidden}
              hidePadding={hidePadding}
              closeOnBackdrop={closeOnBackdrop}>
              {children}
            </ModalBody>
            {showFooter && <ModalFooter onSave={saveAction} onClose={closeAction} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
