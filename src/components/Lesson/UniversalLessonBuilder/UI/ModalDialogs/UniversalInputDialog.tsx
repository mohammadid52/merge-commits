import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import UniversalInput from '../FormElements/UniversalInput';

const UniversalInputDialog = (props: any) => {
  const [list, setList] = useState([{id: uuidv4(), label: '', value: ''}]);

  const [numbered, setNumbered] = useState(false);

  return (
    <div>
      <UniversalInput
        numbered={numbered}
        setNumbered={setNumbered}
        list={list}
        setList={setList}
        {...props}
      />
    </div>
  );
};

export default UniversalInputDialog;
