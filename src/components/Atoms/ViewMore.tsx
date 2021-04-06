import React from 'react';
import Buttons from './Buttons';

const ViewMore = ({ text, onClick }: { text: string; onClick: any }): React.ReactElement => {
  return (
    <div className="w-auto float-right">
      <Buttons
        label={text}
        onClick={onClick}
        type="button"
        // btnClass="inline-flex items-center px-3 py-2 border-0 border-gray-300 shadow-sm text-sm leading-4 font-semibold rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none"
      />
    </div>
  );
};

export default ViewMore;
