import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import SelectOne from '../FormElements/UniversalOption';

const UniversalOptionDialog = (props: any) => {
  const [optionList, setOptionList] = useState([
    {
      id: uuidv4(),
      label: '',
      required: false,
      inLine: true,
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
        list={optionList}
        setList={setOptionList}
        {...props}
      />
    </div>
  );
};

export default UniversalOptionDialog;
