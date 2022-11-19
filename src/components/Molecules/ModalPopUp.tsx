import React from 'react';
import Modal from 'atoms/Modal';
import Buttons from 'atoms/Buttons';
import Tooltip from 'atoms/Tooltip';

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
  smallText?: string;
  dataCy?: string;
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
    smallText,
    titleButton,
    className = 'w-168',
    dataCy
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
        {smallText && (
          <p className="my-4 px-6 text-gray-700 text-xs font-medium leading-8">
            {smallText}
          </p>
        )}
        <div className="flex justify-center mt-16 w-full mx-auto">
          {deleteModal ? (
            <Buttons
              dataCy={dataCy}
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
                  dataCy={dataCy}
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
                  btnClass="px-10 py-3 mr-4"
                  onClick={saveAction}
                />
              </Tooltip>
            )
          )}

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
