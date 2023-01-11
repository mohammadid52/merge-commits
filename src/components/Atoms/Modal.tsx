import {GlobalContext} from 'contexts/GlobalContext';
import ModalHeader from 'molecules/ModalHeader';
import React, {useContext, useEffect} from 'react';
import {IoClose} from 'react-icons/io5';
import Buttons from './Buttons';
// @ts-ignore

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
  saveElement?: React.ReactNode;
  customTitle?: React.ReactNode;
  outerCloseBtn?: boolean;
  position?: 'absolute' | 'relative' | 'fixed';
  width?: string;
  className?: string;
  modalCloseId?: string;
  maxWidth?: string;
  closeLabel?: string;
  saveLabel?: string;
}

const ModalBody = (bodyProps: {
  children: React.ReactNode;
  hidePadding?: boolean;
  closeOnBackdrop?: boolean;
  scrollHidden?: boolean;
  className?: string;
}) => {
  const {children, closeOnBackdrop, className = 'modal-body', hidePadding} = bodyProps;

  return (
    <div
      className={`relative ${
        hidePadding ? 'p-0' : `${closeOnBackdrop ? 'p-2' : 'p-4'}`
      } flex-auto overflow-hidden ${className}`}>
      {' '}
      {/* // flex-auto changed to flex-1 overflow-hidden */}
      {children}
    </div>
  );
};

const ModalFooter = (footerProps: {
  onSave?: () => void;
  onClose?: () => void;
  closeLabel?: string;
  saveLabel?: string;
}) => {
  const {onSave, onClose, saveLabel = 'Save changes', closeLabel = 'Close'} = footerProps;
  const {theme} = useContext(GlobalContext);

  return (
    <div className={`${theme.modals.footer}`}>
      <Buttons label={closeLabel} title={closeLabel} onClick={onClose} transparent />
      <Buttons label={saveLabel} title={saveLabel} onClick={onSave} />
    </div>
  );
};

const Modal: React.FC<ModalProps> = (modalProps: ModalProps) => {
  const {
    showHeader,
    modalCloseId,
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
    outerCloseBtn = false,
    customTitle,
    position,
    width,
    maxWidth,
    className,
    closeLabel,
    saveLabel
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
        style={{zIndex: 9999}}
        className={`${
          intenseOpacity ? 'dark-backdrop' : 'backdrop fade-in'
        } fixed inset-0 bg-black`}></div>
      <div
        style={{zIndex: 10000}}
        onClick={() => closeOnBackdrop && closeAction()}
        className={`${
          position ? position : 'fixed'
        } modal transition-all duration-500 show justify-center items-center flex overflow-x-hidden overflow-y-auto inset-0 outline-none focus:outline-none`}>
        <div
          onClick={(e) => {
            if (closeOnBackdrop) {
              e.stopPropagation();
            }
          }}
          className={`${width ? width : 'w-auto'} ${
            maxWidth ? maxWidth : 'max-w-lg'
          } relative my-4 mx-auto sm:max-w-140 max-w-80  max-h-9/10 md:max-w-172 lg:max-w-256`}>
          {outerCloseBtn && (
            <div style={{top: '-2rem', right: '-2rem'}} className="w-auto absolute">
              <button
                data-cy={modalCloseId}
                className={`ml-auto w-auto ${theme.outlineNone}`}
                onClick={closeAction}>
                <span className="w-8 h-8 ml-4 flex cursor-pointer  items-center justify-center rounded transition-all duration-150">
                  <IoClose className="text-white" />
                </span>
              </button>
            </div>
          )}
          <div className={`${theme.modals[hidePadding ? 'hideBg' : 'content']}`}>
            {showHeader && (
              <ModalHeader
                titleButton={titleButton}
                customTitle={customTitle}
                modalCloseId={modalCloseId}
                title={title}
                onClick={closeAction}
                showBorder={showHeaderBorder}
              />
            )}
            <ModalBody
              className={className}
              scrollHidden={scrollHidden}
              hidePadding={hidePadding}
              closeOnBackdrop={closeOnBackdrop}>
              {children}
            </ModalBody>
            {showFooter && (
              <ModalFooter
                closeLabel={closeLabel}
                saveLabel={saveLabel}
                onSave={saveAction}
                onClose={closeAction}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
