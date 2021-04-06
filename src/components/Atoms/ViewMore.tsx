import React from 'react';
import Buttons from './Buttons';

const ViewMore = ({ text, onClick }: { text: string; onClick: any }): React.ReactElement => {
  return (
    <div className="w-auto float-right">
      <Buttons label={text} onClick={onClick} type="button" />
    </div>
  );
};

export default ViewMore;
