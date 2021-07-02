import React, {useState} from 'react';
import ModalPopUp from '../../../Molecules/ModalPopUp';

const useUnsavedChanges = (closeAction: () => void) => {
  const [warnModal, setWarnModal] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  const askBeforeClose = () => {
    if (unsavedChanges) {
      setWarnModal(true);
    } else {
      closeAction();
    }
  };

  const discardChanges = () => {
    setWarnModal(false);
    setUnsavedChanges(false);
    closeAction();
  };

  const UnsavedModal = ({message}: {message?: string}) => {
    return (
      warnModal && (
        <ModalPopUp
          saveLabel="Yes"
          saveAction={discardChanges}
          saveTooltip="I want to discard changes"
          cancelLabel="Cancel"
          closeAction={() => setWarnModal(false)}
          cancelTooltip="Keep writing"
          message={message || 'You have unsaved changes. Do you want to exit?'}
        />
      )
    );
  };

  return {askBeforeClose, setUnsavedChanges, unsavedChanges, UnsavedModal};
};

export default useUnsavedChanges;
