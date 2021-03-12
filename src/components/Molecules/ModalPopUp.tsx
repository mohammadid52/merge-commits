import React from 'react'
import Modal from '../Atoms/Modal';
import Buttons from '../Atoms/Buttons';

interface ModalProps {
  saveAction?: () => void
  closeAction?: () => void
  message?: string
  saveLabel?: string
  onlyInfo?: boolean
  deleteModal?: boolean
  deleteLabel?: string
}

const ModalPopUp = (props: ModalProps) => {
  const { saveAction, closeAction, message, saveLabel, onlyInfo, deleteModal, deleteLabel } = props;
  return (
    <Modal showHeader={true} showHeaderBorder={false} showFooter={false} closeAction={closeAction}>
      <div className="w-168 text-center my-8">
        <p className="my-4 px-6 text-gray-800 text-lg font-medium leading-8">{message}</p>
        <div className="flex justify-around mt-16 w-5/10 mx-auto">
          {!onlyInfo &&
            <Buttons label="Cancel" btnClass='px-8 py-3 mr-4' onClick={closeAction} transparent />
          }
          {deleteModal ? <Buttons label={deleteLabel ? deleteLabel : 'Delete'} btnClass='px-10 py-3 ml-4 text-red-600 border-red-600 hover:bg-gray-100 hover:text-red-500' onClick={saveAction} transparent />
            :
            <Buttons label={saveLabel ? saveLabel : "Save"} btnClass='px-10 py-3 ml-4' onClick={saveAction} />
          }
        </div>
      </div>
    </Modal>
  )
}

export default ModalPopUp
