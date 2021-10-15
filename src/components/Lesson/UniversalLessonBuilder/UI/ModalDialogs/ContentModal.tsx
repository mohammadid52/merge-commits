import ModalHeader from '@components/Molecules/ModalHeader';
import {useGlobalContext} from '@contexts/GlobalContext';
import React, {useEffect} from 'react';

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

const ModalBody = (bodyProps: {
  children: React.ReactNode;
  hidePadding?: boolean;
  closeOnBackdrop?: boolean;
  scrollHidden?: boolean;
}) => {
  const {
    children,

    closeOnBackdrop,

    scrollHidden,
    hidePadding,
  } = bodyProps;

  return (
    <div
      className={`relative ${
        hidePadding ? 'p-0' : `${closeOnBackdrop ? 'p-2' : 'p-4'}`
      } flex-auto modal-body`}
      style={{maxHeight: 'calc(100vh - 150px)'}}>
      {children}
    </div>
  );
};

const ModalFooter = (footerProps: {onSave?: () => void; onClose?: () => void}) => {
  const {onSave, onClose} = footerProps;
  const {theme} = useGlobalContext();

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

const ContentModal: React.FC<ModalProps> = (modalProps: ModalProps) => {
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
  const {theme} = useGlobalContext();

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
        } absolute  inset-0 bg-black`}></div>
      <div
        style={{zIndex: 10000}}
        onClick={() => closeOnBackdrop && closeAction()}
        className={
          'absolute  modal dark-scroll transition-all bg-black bg-opacity-80 duration-500 show justify-center items-start flex overflow-x-hidden overflow-y-auto inset-0 outline-none focus:outline-none py-24'
        }>
        <div
          onClick={(e) => {
            if (closeOnBackdrop) {
              e.stopPropagation();
            }
          }}
          className="relative w-auto my-4 mx-auto max-w-lg ">
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

export default ContentModal;
