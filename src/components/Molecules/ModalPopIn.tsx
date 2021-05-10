import React from 'react';
import Modal from '../Atoms/Modal';
import Buttons from '../Atoms/Buttons';
import ModalInside from '../Atoms/ModalInside';
import {
  ModalProps,
  ULBDialogComponent,
} from '../../interfaces/UniversalLessonBuilderInterfaces';

interface ModalPopInProps extends ModalProps, ULBDialogComponent {}

const ModalPopIn = (props: ModalPopInProps) => {
  const {
    saveAction,
    closeAction,
    message,
    saveLabel,
    onlyInfo,
    deleteModal,
    deleteLabel,
    cancelLabel,
    inputJSX,
  } = props;

  const InputJSX = () => inputJSX;

  return (
    <ModalInside
      inside={true}
      showHeader={true}
      showHeaderBorder={false}
      showFooter={false}
      closeAction={closeAction}>
      <div className="w-168 text-center my-8 z-100">
        <div className="my-4 px-6 text-lg font-medium leading-8">
          <InputJSX />
        </div>
        <div className="flex justify-around mt-16 w-5/10 mx-auto">
          {!onlyInfo && (
            <Buttons
              label={cancelLabel ? cancelLabel : 'Cancel'}
              btnClass="px-8 py-3 mr-4"
              onClick={closeAction}
              transparent
            />
          )}

          <Buttons
            label={saveLabel ? saveLabel : 'Save'}
            btnClass="px-10 py-3 ml-4"
            onClick={saveAction}
          />
        </div>
      </div>
    </ModalInside>
  );
};

export default ModalPopIn;
