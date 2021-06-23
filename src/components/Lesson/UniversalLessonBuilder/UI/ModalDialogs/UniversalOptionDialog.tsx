import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import SelectOne from '../FormElements/UniversalOption';

const UniversalOptionDialog = ({
  updateContent,
  selectedForm,
  isEditingMode,
  closeAction,
  createNewContent,
}: any) => {
  const [optionList, setOptionList] = useState([
    {
      id: uuidv4(),
      label: '',
      options: [
        {label: '1', text: '', id: uuidv4()},
        {label: '2', text: '', id: uuidv4()},
      ],
    },
  ]);
  const [numbered, setNumbered] = useState(false);

  return (
    <div>
      <SelectOne
        numbered={numbered}
        setNumbered={setNumbered}
        closeAction={closeAction}
        isEditingMode={isEditingMode}
        updateContent={updateContent}
        selectedForm={selectedForm}
        createNewContent={createNewContent}
        list={optionList}
        setList={setOptionList}
      />
    </div>
  );
};

export default UniversalOptionDialog;
