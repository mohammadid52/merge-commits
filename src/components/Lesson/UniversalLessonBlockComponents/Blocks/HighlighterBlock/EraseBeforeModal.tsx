import Modal from '@components/Atoms/Modal';
import React from 'react';
import PositiveAlert from '../../../../General/Popup';

const EraseBeforeModal = ({show, id, setShow, onYes, onCancel}: any) => {
  return (
    <div>
      <PositiveAlert
        alert={show}
        id={id}
        setAlert={setShow}
        header={
          'Do you want to reset text? If you click yes your updates will be lost. Do you want to continue? '
        }
        button1={`Yes`}
        button2="Cancel"
        svg="question"
        handleButton1={onYes}
        handleButton2={onCancel}
        theme="dark"
        fill="screen"
      />
    </div>
  );
};

export default EraseBeforeModal;
