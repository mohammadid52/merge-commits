import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {INPUT} from '../common/constants';
import UniversalInput from '../FormElements/UniversalInput';

const UniversalInputDialog = (props: any) => {
  const {selectedForm} = props;
  const initState =
    selectedForm === INPUT
      ? {id: uuidv4(), textArea: false, label: '', value: ''}
      : {id: uuidv4(), label: '', value: ''};
  const [list, setList] = useState([{...initState}]);

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
