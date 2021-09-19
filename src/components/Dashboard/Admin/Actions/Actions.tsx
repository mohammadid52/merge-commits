import React from 'react';
import ActionButton from './ActionButton';

const Actions: React.FC = () => {
  return (
    <>
      <ActionButton label={'V'} func={() => console.log('v')} />
      <ActionButton label={'E'} func={() => console.log('e')} />
      <ActionButton label={'R'} func={() => console.log('r')} />
    </>
  );
};

export default Actions;
