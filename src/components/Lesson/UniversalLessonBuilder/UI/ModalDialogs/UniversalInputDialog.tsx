import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import UniversalInput from '../FormElements/UniversalInput';

const UniversalInputDialog = (props: any) => {
  const {
    updateContent,
    selectedForm,
    isEditingMode,
    closeAction,
    createNewContent,
  } = props;

  const [list, setList] = useState([{id: uuidv4(), label: '', value: ''}]);

  const [numbered, setNumbered] = useState(false);

  return (
    <div>
      <UniversalInput
        numbered={numbered}
        setNumbered={setNumbered}
        closeAction={closeAction}
        isEditingMode={isEditingMode}
        updateContent={updateContent}
        selectedForm={selectedForm}
        createNewContent={createNewContent}
        list={list}
        setList={setList}
      />
    </div>
  );
};

export default UniversalInputDialog;
