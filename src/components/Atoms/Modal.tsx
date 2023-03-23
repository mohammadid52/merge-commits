import {Modal as AntdModal} from 'antd';
import React from 'react';
// @ts-ignore

interface ModalProps {
  showHeader?: boolean;
  title?: string;
  showHeaderBorder?: boolean;
  showFooter?: boolean;
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
  width?: string | number;
  className?: string;
  modalCloseId?: string;
  maxWidth?: string;
  closeLabel?: string;
  saveLabel?: string;
  open: boolean;
}

const Modal: React.FC<ModalProps> = (modalProps: ModalProps) => {
  const {
    title,
    width,
    children,

    closeAction,

    open,

    customTitle
  } = modalProps;

  return (
    <AntdModal
      width={width}
      open={open}
      onCancel={closeAction}
      title={title || customTitle}
      footer={null}>
      {children}
    </AntdModal>
  );
};

export default Modal;
