import React, { useState } from 'react'

interface ModalProps {
  showHeader: boolean
  title?: string
  showFooter: boolean
  children: React.ReactNode
  saveAction?: () => void
  closeAction?: () => void
}

const ModalHeader = (headerProps: { title?: string, onClick?: () => void }) => {
  const { title, onClick } = headerProps;
  return (
    <div className="modal-header">
      <h3 className="text-xl font-semibold">{title && title}</h3>
      <button
        className="modal-close w-auto btn"
        onClick={onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className={`text-secondary stroke-current inline-block h-5 w-5`}>
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  )
}

const ModalBody = (bodyProps: { children: React.ReactNode }) => {
  const { children } = bodyProps
  return (
    <div className="relative p-4 flex-auto">
      {children}
    </div>
  )
}

const ModalFooter = (footerProps: { onSave?: () => void, onClose?: () => void }) => {
  const { onSave, onClose } = footerProps;

  return (
    <div className="modal-footer children-x-2">
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
  )
}

const Modal: React.FC<ModalProps> = (modalProps: ModalProps) => {
  const { showHeader, title, showFooter, children, closeAction, saveAction } = modalProps

  return (
    <>
      <div className="backdrop fade-in fixed inset-0 z-40 bg-black"></div>
      <div className="modal show justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-4 mx-auto max-w-lg">
          <div className="modal-content">
            {showHeader && <ModalHeader title={title} onClick={closeAction} />}
            <ModalBody>{children}</ModalBody>
            {showFooter && <ModalFooter onSave={saveAction} onClose={closeAction} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
