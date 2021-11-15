import React from 'react';
import Modal from '../Atoms/Modal';
import Buttons from '../Atoms/Buttons';
import Tooltip from '../Atoms/Tooltip';

interface ModalProps {
  saveAction?: (e?: any) => void;
  closeAction?: () => void;
  cancelAction?: () => void;
  message?: string;
  saveLabel?: string;
  onlyInfo?: boolean;
  deleteModal?: boolean;
  deleteLabel?: string;
  cancelLabel?: string;
  noButton?: string;
  noButtonAction?: () => void;
  loading?: boolean;
  saveTooltip?: string;
  cancelTooltip?: string;
  noTooltip?: string;
  titleButton?: React.ReactElement;
  className?: string;
}

const ModalPopUp = (props: ModalProps) => {
  const {
    saveAction,
    closeAction,
    cancelAction,
    message,
    saveLabel,
    onlyInfo,
    deleteModal,
    deleteLabel,
    cancelLabel,
    noButton,
    noButtonAction,
    loading,
    cancelTooltip,
    noTooltip,
    saveTooltip,
    titleButton,
    className = 'w-168',
  } = props;
  return (
    <Modal
      titleButton={titleButton}
      closeOnBackdrop
      showHeader={true}
      showHeaderBorder={false}
      showFooter={false}
      closeAction={closeAction}>
      <div className={`${className} text-center my-8`}>
        <p className="my-4 px-6 text-gray-800 text-lg font-medium leading-8">{message}</p>
        <div className="flex justify-center mt-16 w-full mx-auto">
          {noButton && (
            <Tooltip show={noTooltip ? true : false} placement="bottom" text={noTooltip}>
              <Buttons
                label={noButton}
                btnClass="px-8 py-3 mr-4"
                onClick={noButtonAction}
                transparent
              />
            </Tooltip>
          )}

          {deleteModal ? (
            <Buttons
              label={deleteLabel ? deleteLabel : 'Delete'}
              btnClass="px-10 py-3 ml-4 text-red-600 border-red-600 hover:bg-gray-100 hover:text-red-500"
              onClick={saveAction}
              transparent
            />
          ) : (
            saveAction !== undefined && (
              <Tooltip
                show={saveTooltip ? true : false}
                placement="bottom"
                text={saveTooltip}>
                <Buttons
                  disabled={loading}
                  label={
                    saveLabel
                      ? loading
                        ? 'Saving'
                        : saveLabel
                      : loading
                      ? 'Saving'
                      : 'Save'
                  }
                  btnClass="px-10 py-3 ml-4"
                  onClick={saveAction}
                />
              </Tooltip>
            )
          )}

          {!onlyInfo && (
            <Tooltip
              show={cancelTooltip ? true : false}
              placement="bottom"
              text={cancelTooltip}>
              <Buttons
                label={cancelLabel ? cancelLabel : 'Cancel'}
                btnClass="px-8 py-3 mr-4"
                onClick={cancelAction !== undefined ? cancelAction : closeAction}
                transparent
              />
            </Tooltip>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalPopUp;
